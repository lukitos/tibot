console.log('in index.js');

const apiai = require("apiai")(process.env.APIAI_CLIENT_TOKEN);
const uuidv4 = require('uuid/v4');

// include and merge all intents:
const date = require('./date');
const time = require('./time');
const pizza = require('./pizza');
const appt = require('./appointment');
const intents = Object.assign({}, date, time, pizza, appt);

// console.log('in index.js >>> intents=', intents);

// Process intents at API.AI, and get action and parameters
const callApiAi = (text, sessionId, tz) => new Promise((resolve, reject) => {
  const request = apiai.textRequest(text, { sessionId: sessionId, timezone: tz });

  request.on('response', response => resolve(response));
  request.on('error', error => reject(error));
  request.end();
});

// Process the action
const doIntent = (response, tz) => {
  console.log('in doIntent >>> response', response);
  const { parameters, action, fulfillment } = response.result;

  // console.log('parameters >>> ', parameters);
  // console.log('action >>> ', action);
  // console.log('fulfillment >>> ', fulfillment);

  return new Promise((resolve, reject) => {
    if (intents[action]) {
      return resolve(intents[action](parameters, fulfillment));
    } else if (fulfillment.speech) {
      return resolve(fulfillment.speech);
    }
    return reject(handleUnknownAnswer());
  });
}

const handleUnknownAnswer = (err) => {
  console.log('in handleUnknownAnswer >>> err=', err);
  const msgs = [
    'Didn\'t quite catch what you said?',
    'Donno',
    'Can you try again?',
    'Sorry, can\'t help you with that?'
  ];

  return msgs[~~(Math.random() * msgs.length)];
};

const processRequest = (msg) => new Promise((resolve, reject) => {
  console.log('in processRequest >>> msg=', msg);
  // try/catch to make sure we don't crush on invalid JSON msgs
  try {
    const input = JSON.parse(msg);

    console.log('input=', input);

    // process our users' request only
    if (input.type === 'user' && input.msg) {
      const sessionId = input.sessionId || uuidv4();
      const tz = input.tz;

      callApiAi(input.msg, sessionId, tz)
        .then(response => doIntent(response, tz))
        .then(answer => resolve(answer))
        .catch(err => resolve(handleUnknownAnswer(err)))
    }
  } catch (err) {
    resolve(handleUnknownAnswer(err));
  }
});

module.exports = processRequest;
