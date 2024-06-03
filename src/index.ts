import express from 'express';
import OpenAI from 'openai';
import serverless from 'serverless-http';
import { Message, empirePersonalities } from './types';

const app = express();
const port = process.env.PORT || 3030;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.get('/warmup', (req, res) => {
  res.json({ message: 'Welcome to the game!' });
});

app.post('/dialogue', async (req, res) => {
  const { message, empire } = req.body;
  console.log('Received request body:', JSON.stringify(req.body, null, 2));
  const {
    empireName,
    capitalName,
    rulerName,
    regionalStrength,
    personality,
    messageHistory,
    playerReputation,
  } = empire;

  if (typeof message !== 'string' || message.length > 300) {
    return res.status(400).send('Invalid data (message).');
  }

  if (!empirePersonalities.includes(personality)) {
    return res.status(400).send('Invalid data (personality).');
  }

  if (
    typeof playerReputation !== 'number' ||
    playerReputation > 10 ||
    playerReputation < 0
  ) {
    return res.status(400).send('Invalid data (playerReputation).');
  }

  const messageHistoryString = messageHistory
    .map((msg: Message) => {
      return `${msg.sender}: ${msg.message}`;
    })
    .join('\n');

  const messageHistoryLimited = '\n' + messageHistoryString.slice(-800) + '\n';

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You're part of a single-player game where the player controls a wizard guild that sends wizards out to kingdoms
            to try to save the world from chaotic events. You are currently controlling a kingdom called ${empireName} from the capital
            of ${capitalName}. You control a ruler called ${rulerName} and your personality trait is '${personality}'. Your regions's 
            strength is ${regionalStrength} where 10 is low, 30 is fairly large. You do not need
            to work with the player. You can be difficult with them as your own kingdom (and maybe greed) matters more than their naivety.
            You regard the player at a score of ${playerReputation} out of 10. 0 being you hate them, and 10 being you'd give lots to
            them to retain their trade. 
            The following is the last 400 characters of the message history: ${messageHistoryLimited}
            They just sent the last message: "${message}". How do you respond? Please keep in mind this is a game and any response should
            be in the context of the game. The messages will be sent over 'crow' mail, so there's a delay in responses and you can't see the player.
            Also please keep the response to 200 characters or less.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    res.json(completion.choices[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if ((process.env.NODE_ENV = 'local')) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export const handler = serverless(app);
