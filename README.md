# iosocket-game-of-life
A "multiplayer" Conway's game of life (with chat)

## Demo
The master branch is directly deployed to heroku: https://iosocket-game-of-life.herokuapp.com/

## Server side

- Node.JS
- Express
- socket.io

### Routes:

- `'/'` : Endpoint for connecting to the socket.io server
- `'/'` : Also returns `index.html` (angular app)
- `'/api/users/list'` : List of connected users
- `'/api/users/rename'` : Expects a `socketId` and a `username`.
- `'/api/users/updateIsTyping'` : Expects a `socketId` and a `isTyping`.
- `'/api/messages/list'` : List of messages
- `'/api/messages/submit'` : Expects a `socketId` parameter and a `body` parameter
- `'/api/messages/clear'` : Expects a `socketId`. Clears all messages.
- `'/api/grid/click'` : Expects a ...
- `'/api/grid/current'` : Returns the current grid state
- `'/api/grid/start'` : Starts simulation
- `'/api/grid/pause'` : Pauses simulation
- `'/api/server/info'` : Returns info about the server (eg. port)

## Client side

- Angular
- Angular's Boostrap UI
- socket.io
- toaster (notifications)
- scrollglue (scroll to bottom of divs)

## Screenshot

![Game of Life](https://raw.githubusercontent.com/germanger/iosocket-game-of-life/screenshot.png)