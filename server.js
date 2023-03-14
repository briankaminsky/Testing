const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const gather = twiml.gather({
    action: '/conference',
    method: 'POST'
  });
  gather.say('Please enter the phone number you would like to call.');

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/conference', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  const conference = dial.conference({
    startConferenceOnEnter: true,
    endConferenceOnExit: false
  }, 'My Conference Room');
  twiml.say('Welcome to the conference. Please listen to this important message.');
  twiml.pause({length: 2});
  twiml.say('This is a test message.');

  const client = new twilio(
    'ACcee3d8b4e61ad63b36d1533c5c704ad8',
    '9d208f3467f6c0ba40e192b35d67a047'
  );
  client.conferences('My Conference Room')
    .participants('Virtual Assistant')
    .remove()
    .then(participant => console.log(participant.status));

  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
