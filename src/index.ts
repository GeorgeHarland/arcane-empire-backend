import express from 'express';
import OpenAI from 'openai';
import serverless from 'serverless-http';

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
  const { message, personality, playerReputation } = req.body;

  const validPersonalities = ['aggressive', 'passive', 'friendly', 'selfish'];

  if (typeof message !== 'string' || message.length > 300) {
    return res.status(400).send('Invalid data (message).');
  }

  if (!validPersonalities.includes(personality)) {
    return res.status(400).send('Invalid data (personality).');
  }

  if (
    typeof playerReputation !== 'number' ||
    playerReputation > 10 ||
    playerReputation < 0
  ) {
    return res.status(400).send('Invalid data (playerReputation).');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You're part of a single-player game where the player controls a wizard guild that sends wizards out to kingdoms.
            You are currently controlling a kingdom. Your personality trait is to be ${personality}, you regard the player at a score of 
            ${playerReputation} out of 10. 0 being you hate them, and 10 being you'd give lots to them to retain their trade. They sent
            this message: "${message}". How do you respond? (Only send the dialogue reply, thanks!)`,
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

export const handler = serverless(app);
