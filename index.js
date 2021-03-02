const http = require('http')

//const app = require('express')()
//app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"))
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-show-modal/src')); 
app.listen(9091, ()=> console.log("Listening on http port 9091"))
const httpServer = http.createServer()
const websocketServer = require('websocket').server


httpServer.listen(9090, ()=> console.log("Listening.. on 9090"))

const clients = {}
const games = {}
const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    console.log("Request Origin: " + request.origin)
    const connection = request.accept(null, request.origin)
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        console.log("Result Method: " + result.method)
        if (result.method === "newGame"){
            console.log("Trying to create a new Game! ClientId: " + result.clientId )
            const clientId = result.clientId
            const gameId = uuidv4();
            games[gameId] = {
                "id": gameId,
                "players": []
            }
            const payLoad = {
                "method": "newGameCreated",
                "game": games[gameId]
            }
            const connection = clients[clientId].connection
            connection.send(JSON.stringify(payLoad))
        }       
        if (result.method === "joinGame"){
            console.log("Trying to join a Game! ClientId: " + result.player.clientId + " GameId: " + result.gameId )
            const player = result.player
            const gameId = result.gameId
           // const clientId = player.clientId
           // const nickName = player.nickName
            let players = games[gameId].players
            let payLoad = {}
            if (players.length < 4){
                players.push(player)
                games[gameId] = {
                    "id": gameId,
                    "players": players
                }
                if (players.length < 4){
                    payLoad = {
                        "method": "gameJoined",
                        "game": games[gameId],
                        "playerJoined": player
                    }
                } else {
                    payLoad = {
                        "method": "gameStarted",
                        "game": games[gameId],
                        "playerJoined": player
                    }
                }
                console.log("game.id: " + games[gameId].id)
                players = games[gameId].players
                games[gameId].players.forEach(player => {
                    const connection = clients[player.clientId].connection
                    connection.send(JSON.stringify(payLoad))
                })
                    
            } else {
                const payLoad = {
                    "method": "gameFull",
                    "game": games[gameId]
                }
                const connection = clients[player.clientId].connection
                connection.send(JSON.stringify(payLoad))
            }
        }
        if (result.method === "leaveGame"){
            console.log("Trying to leave Game " + result.gameId + ". ClientId: " + result.player.clientId )
            const gameId = result.gameId
            const player = result.player
            const clientId = player.clientId
            
            players = games[gameId].players
            players = players.filter((p, index, arr) =>{
                return p.clientId != player.clientId
            })
            // const index = players.indexOf(player);
            // if (index > -1) {
            // players.splice(index, 1);
            // }
            games[gameId] = {
                "id": gameId,
                "players": players
            }
            var payLoad = {
                "method": "playerLeft",
                "game": games[gameId],
                "playerLeft": player
            }
            games[gameId].players.forEach(player => {
                const connection = clients[player.clientId].connection
                connection.send(JSON.stringify(payLoad))
            })
            payLoad = {
                "method": "left",
                "player": player,
            }
            connection.send(JSON.stringify(payLoad))
        }  
    })

    const clientId = uuidv4()
    clients[clientId] = {
        "connection": connection
    } 
    const payLoad = {
        "method": "connect",
        "clientId": clientId,
    }
    connection.send(JSON.stringify(payLoad))
})



function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
