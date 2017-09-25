const server = require('./');
const processRequest = require('./intents');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const wss = new WebSocket.Server({server: server});

// console.log('in websocket.js');

wss.on('connection', (ws) => {
  // console.log('on connection');
  ws.on('message', (msg) => {
    // console.log('ws.on(message) >>> msg=', msg);
    processRequest(msg).then(answer => {
      console.log('answer=', answer);
      ws.send(JSON.stringify({type: 'bot', msg: answer}))
    })
  }
  );

  // Generate sessionId
  ws.send(JSON.stringify({type: 'sessionId', msg: uuidv4()}));
});

module.exports = wss;
