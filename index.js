const http = require('http')
const app = require('express')()
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"))
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
            console.log("Trying to join a Game! ClientId: " + result.clientId + " GameId: " + result.gameId )
            const clientId = result.clientId
            const gameId = result.gameId;
            let players = games[gameId].players
            players.push(clientId)
            games[gameId] = {
                "id": gameId,
                "players": players
            }
            const payLoad = {
                "method": "gameJoined",
                "game": games[gameId]
            }
            console.log("game.id: " + games[gameId].id)
            players = games[gameId].players
            console.log("Players: " + players)
            games[gameId].players.forEach(player => {
                const connection = clients[player].connection
                connection.send(JSON.stringify(payLoad))
             })
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
