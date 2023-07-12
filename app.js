var express = require('express');
var app = express();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.disable('x-powered-by');
app.use(cors({
    origin: '*'
}));

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/text-to-emoji', async (req, res) => {
    if (req.headers['x-rapidapi-proxy-secret'] !== process.env.X_RAPIDAPI_PROXY_SECRET) {
        res.sendStatus(401);
        return;
    }

    try {
        let input = req.body.input;

        if ((await openai.createModeration({ input: input })).data.results[0].flagged) {
            throw new Error("Profene input.");
        }

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": ("Write the text below in emoji. \n\n Text: \"\"\" \n" + input + "\n\"\"\"") },
            ],
            temperature: 0.1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.post('/chat', async (req, res) => {
    if (req.headers['x-rapidapi-proxy-secret'] !== process.env.X_RAPIDAPI_PROXY_SECRET) {
        res.sendStatus(401);
        return;
    }

    try {
        let conversation = req.body.conversation;

        if ((await openai.createModeration({ input: conversation.map(x => x.content) })).data.results[0].flagged) {
            throw new Error("Profene input.");
        }

        let chatConversation = [{
            role: "system",
            content: `You are a assistent that helps with anything.`
        }
        ].concat(conversation);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.post('/code', async (req, res) => {
    if (req.headers['x-rapidapi-proxy-secret'] !== process.env.X_RAPIDAPI_PROXY_SECRET) {
        res.sendStatus(401);
        return;
    }

    try {
        let request = req.body.request;

        if ((await openai.createModeration({ input: Object.values(request).map(x => x.content) })).data.results[0].flagged) {
            throw new Error("Profene input.");
        }

        let chatConversation = [{
            role: "system",
            content: `You are an assistent that helps with coding.`,
        },
        {
            role: "user",
            content: `The request is: \n\n \"\"\" \n${request.request.content}\n\"\"\"`,
        },
        {
            role: "user",
            content: `The code is: \n\n \"\"\" \n${request.code.content}\n\"\"\"`,
        },
        {
            role: "user",
            content: `The language is: \n\n \"\"\" \n${request.language.content}\n\"\"\"`,
        }];

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.post('/translator', async (req, res) => {
    if (req.headers['x-rapidapi-proxy-secret'] !== process.env.X_RAPIDAPI_PROXY_SECRET) {
        res.sendStatus(401);
        return;
    }

    try {
        let request = req.body.request;

        if ((await openai.createModeration({ input: Object.values(request).map(x => x.content) })).data.results[0].flagged) {
            throw new Error("Profene input.");
        }

        let chatConversation = [{
            role: "system",
            content: `You are a translator that helps with translates.`,
        },
        {
            role: "user",
            content: `The target language is: \n\n \"\"\" \n${request.language.content}\n\"\"\"`,
        },
        {
            role: "user",
            content: `The text to translate is: \n\n \"\"\" \n${request.text.content}\n\"\"\"`,
        }];

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});