const express = require('express');
const { dockStart, Nlp } = require('@nlpjs/basic');

const app = express();
app.use(express.json());

app.post('/process', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    //  await manager.train();
    const dock = await dockStart();
    const nlp = dock.get('nlp');
    nlp.onIntent = onIntent;
    await nlp.train();
    const response = await nlp.process('en', text);

    res.json(response?.answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function onIntent(nlp, input) {
  if (input.intent === 'whatTimeIsIt') {
    const output = input;
    const now = new Date();

    // Get the current time components
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format the time components as needed (e.g., add leading zeros)
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


    output.answer = `Current time is: ${formattedTime}`;
  }
  return input;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
