# Do-Nothing-Game

## Use of Nodejs and Websockets - without socket.io

This implementation shows the use of nodejs express und websockets.

The client-server interaction only uses plain websockets. No socket.io or similar.

## The "Game"-Flow

There are 3 Screens.

### Start-Screen
In the start-screen you choose a nickname and either create a new game-id or past in an existing one.
Than you connect

<img src="https://github.com/JanMeckelholt/do-nothing-game/blob/master/git-pictures/start-screen.png" width="400px">

### Waiting-room-Screen
When you connect you go to the waiting room. You will stay here until 3 other player join that Game ID.

<img src="https://github.com/JanMeckelholt/do-nothing-game/blob/master/git-pictures/wait-screen.png" width="400px">

### Play Screen
At the play screen you see yourself and your 3 game partners.
You can push your "Do absolutely nothing"-Button! :-)

<img src="https://github.com/JanMeckelholt/do-nothing-game/blob/master/git-pictures/play-screen.png" width="400px">
