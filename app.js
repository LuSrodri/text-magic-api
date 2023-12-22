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

const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.post('/math-assistant', async (req, res) => {
    try {
        let input = req.body.input;

        if ((await openai.moderations.create({ input: input })).results[0].flagged) {
            throw new Error("Profene input.");
        }

        const assistant = await openai.beta.assistants.create({
            name: "Math Tutor",
            instructions: "You are a personal math tutor. Write and run code to answer math questions.",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4-1106-preview"
        });

        const thread = await openai.beta.threads.create();

        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: input,
            }
        );

        const run = await openai.beta.threads.runs.create(
            thread.id,
            {
                assistant_id: assistant.id,
                instructions: "Response in markdown format.",
            }
        );

        let isRunned = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        while (isRunned.status != "completed") {
            isRunned = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
        }

        const response = (await openai.beta.threads.messages.list(
            thread.id
        )).data[0].content;

        res.statusCode = 200;
        res.send({ output: response[0].text });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.post('/text-to-emoji', async (req, res) => {
    if (req.headers['x-rapidapi-proxy-secret'] !== process.env.X_RAPIDAPI_PROXY_SECRET) {
        res.sendStatus(401);
        return;
    }

    try {
        let input = req.body.input;

        if ((await openai.moderations.create({ input: input })).results[0].flagged) {
            throw new Error("Profene input.");
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
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
        res.send({ output: response.choices[0].message.content });
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

        if ((await openai.moderations.create({ input: conversation.map(x => x.content) })).results[0].flagged) {
            throw new Error("Profene input.");
        }

        let chatConversation = [{
            role: "system",
            content: `You are a assistent that helps with anything.`
        }
        ].concat(conversation);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.choices[0].message });
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

        if ((await openai.moderations.create({ input: Object.values(request).map(x => x.content) })).results[0].flagged) {
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

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.choices[0].message });
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

        if ((await openai.moderations.create({ input: Object.values(request).map(x => x.content) })).results[0].flagged) {
            throw new Error("Profene input.");
        }

        let chatConversation = [{
            role: "system",
            content: `You are a translator that helps with translates. You can translate from any language to target language. You can translate a word, a phrase or a text. The response will be ONLY the text/phrase/word translated in target language.`,
        },
        {
            role: "user",
            content: `The target language is: \n\n \"\"\" \n${request.language.content}\n\"\"\"`,
        },
        {
            role: "user",
            content: `The text/phrase/word will be translate is: \n\n \"\"\" \n${request.text.content}\n\"\"\"`,
        }];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: chatConversation,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.choices[0].message });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Some problem with the input. Try again with another input." });
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});