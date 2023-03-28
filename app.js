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
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
             {"role": "user", "content": ("Write the text below in emoji. \n\n Text: \"\"\" \n" + input + "\n\"\"\"")},   
            ],
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e.error);
        res.sendStatus(400);
    }
});

app.post('/explain-code', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
             {"role": "user", "content": ("Explain the code below: \n\n Code: \"\"\" \n" + input.trim() + "\n\"\"\"")},   
            ],
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e.error);
        res.sendStatus(400);
    }
});

app.post('/fixes-code', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the code below in the better way: \n\n Code: \"\"\" \n" + input.trim() + "\n\"\"\""),
            temperature: 0,
            max_tokens: 350,
            top_p: 0,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/fixes-text', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the text below fixing the possible mistakes: \n\n Text: \"\"\" \n" + input + "\n\"\"\""),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/html-to-markdown', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the html code below in markdown style: \n\n Code: \"\"\" \n" + input + "\n\"\"\""),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/markdown-to-html', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the markdown code below in html: \n\n Code: \"\"\" \n" + input + "\n\"\"\""),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/js-to-python', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the javascript code below in useful python code: \n\n Code: \"\"\" \n" + input + "\n\"\"\""),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/python-to-js', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;

    const isProfane = await openai.createModeration({ input: input });

    if (isProfane.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ("Rewrite the python code below in useful javascript code: \n\n Code: \"\"\" \n" + input + "\n\"\"\""),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

function verifyIfHasInputBody(req) {
    if (req.body) {
        if (req.body.input) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});