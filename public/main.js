

const startPage = document.getElementById("startPage")
const waitPage = document.getElementById("waitPage")
const playPage = document.getElementById("playPage")
//const btnNewGame = document.getElementById("btnNewGame")
const chkNewGame = document.getElementById("chkNewGame")
const btnJoinGame = document.getElementById("btnJoinGame")
const btnLeaveGame = document.getElementById("btnLeaveGame")
const txtGameId = document.getElementById("txtGameId")
const txtNickName = document.getElementById("txtNickName")
const lblJoinedPlayers = document.getElementById("lblJoinedPlayers")

const txtCard1 = document.getElementById("txtCard1")
const txtCard2 = document.getElementById("txtCard2")
const txtCard3 = document.getElementById("txtCard3")
const txtCard4 = document.getElementById("txtCard4")

const titleCard1 = document.getElementById("titleCard1")
const titleCard2 = document.getElementById("titleCard2")
const titleCard3 = document.getElementById("titleCard3")
const titleCard4 = document.getElementById("titleCard4")

txtGameId.value = ''
txtNickName.value = ''
chkNewGame.checked = false
// lblJoinedPlayers.innerText = ''

// btnNewGame.addEventListener("click", e => {
//     const payLoad = {
//         "method": "newGame",
//         "clientId": clientId
//     }
//     ws.send(JSON.stringify(payLoad))
// })
chkNewGame.addEventListener("change", e => {
    console.log("Checkbox changed!")
    if (e.target.checked){
        if (gameId === null){
            const payLoad = {
                "method": "newGame",
                "clientId": player.clientId
            }
            ws.send(JSON.stringify(payLoad))
        }
        txtGameId.value=gameId
        txtGameId.readOnly = true
    }
    else {
        txtGameId.readOnly = false
    }
})

btnJoinGame.addEventListener("click", e => {
    if (txtNickName.value ==''){
        $.showAlert({title: "Join a Game", body: "Nickname can not be empty."})
        txtNickName.focus()
        txtNickName.select()
    } else if(!isValid(txtGameId.value)){
            $.showAlert({title: "Join a Game", body: "Game ID is not valid."})
            txtGameId.focus()
            txtGameId.select()
            } else {
                if (gameId === null){
                    gameId = txtGameId.value
                }
                player.nickName=txtNickName.value
                const payLoad = {
                    "method": "joinGame",
                    "player": player,
                    "gameId": gameId
                }
                ws.send(JSON.stringify(payLoad))
            }
})      

btnLeaveGame.addEventListener("click", e => {
    const payLoad = {
        "method": "leaveGame",
        "player": player,
        "gameId": gameId
    }
    ws.send(JSON.stringify(payLoad))
})


let player = {clientId: null, nickName: null}
//let clientId = null
//let nickName = null
let gameId = null
let joinedPlayers = null
let ws = new WebSocket("ws://localhost:9090")
ws.onmessage = message => {
    const response = JSON.parse(message.data)
    console.log("Response Method: " + response.method)
    if (response.method === "connect"){
        player.clientId = response.clientId
        startPage.style.display = 'block'
        waitPage.style.display = 'none'
        console.log("ClientId set to: "  + player.clientId)
    } 
    if (response.method === "newGameCreated"){
        gameId = response.game.id
        console.log("Game with id " + gameId + " created!")
        txtGameId.value = gameId
    }  
    if (response.method === "gameJoined"){
        gameId = response.game.id
        console.log("Game with id " + gameId + " joined!")
        //startPage.remove()
        startPage.style.display = 'none'
        waitPage.style.display = 'block'
        // waitPage.style.visibility = true
        txtGameId.value = gameId
        lblJoinedPlayers.innerText='You joined Game: ' + gameId
        lblJoinedPlayers.innerHTML += '<br/> The following player are waiting with you: <br/>'
        response.game.players.forEach(player =>{
            lblJoinedPlayers.innerText += player.nickName 
            lblJoinedPlayers.innerHTML += '<br/>' 
        })
    }    
    if (response.method === "gameStarted"){
        game = response.game
        console.log("Game with id " + game.id + " started!")
        //startPage.remove()
        startPage.style.display = 'none'
        waitPage.style.display = 'none'
        playPage.style.display = 'block'
        titleCard1.innerHTML=game.players[0].nickName
        titleCard2.innerHTML=game.players[1].nickName
        titleCard3.innerHTML=game.players[2].nickName
        titleCard4.innerHTML=game.players[3].nickName
        
        txtCard1.innerHTML='Hello! Good to be bored!'
        txtCard2.innerHTML='Hello! Good to be bored!'
        txtCard3.innerHTML='Hello! Good to be bored!'
        txtCard4.innerHTML='Hello! Good to be bored!'


        // waitPage.style.visibility = true
        // txtGameId.value = gameId
        // lblJoinedPlayers.innerText='You joined Game: ' + gameId
        // lblJoinedPlayers.innerHTML += '<br/> The following player are waiting with you: <br/>'
        // response.game.players.forEach(player =>{
        //     lblJoinedPlayers.innerText += player.nickName 
        //     lblJoinedPlayers.innerHTML += '<br/>' 
        // })
    }
    if (response.method === "gameFull"){
        gameId = response.game.id
        console.log("Game with id " + gameId + " is full")
        txtGameId.value = gameId
        $.showAlert({title: "Join Game", body: "Game with id " + gameId + " is full"})
    }  
    if (response.method === "playerLeft"){
        gameId = response.game.id
        const playerLeft = response.playerLeft
        console.log(playerLeft.nickName + " left the game")
        txtGameId.value = gameId
        $.showAlert({title: "Player left", body: playerLeft.nickName + " left the game."})
        //lblJoinedPlayers.innerText= playerLeft. + " left the game"
        lblJoinedPlayers.innerText= ''
        lblJoinedPlayers.innerHTML += '<br/> The following player are waiting with you: <br/>'
        response.game.players.forEach(player =>{
            lblJoinedPlayers.innerText += player.nickName 
            lblJoinedPlayers.innerHTML += '<br/>' 
        })
    } 
    if (response.method === "left"){
        player.clientId = response.player.clientId
        player.checkednickName = response.player.nickName
        startPage.style.display = 'block'
        waitPage.style.display = 'none'
        txtNickName.value = player.nickName
        chkNewGame.checked=false
    }  
}

function isValid(testText) {
    var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return pattern.test(testText)
}
  