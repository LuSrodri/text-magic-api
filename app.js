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
        console.log(e);
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
             {"role": "user", "content": ("Explain the code below: \n\n Code: \"\"\" \n" + input.trim() + "\n\"\"\"\n The response must be in HTML format")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
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
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
             {"role": "user", "content": ("Refactor the code below in the better way: \n\n Code: \"\"\" \n" + input.trim() + "\n\"\"\"\n The response must be in HTML format")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
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
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
             {"role": "user", "content": ("Rewrite the text below fixing the possible mistakes: \n\n Text: \"\"\" \n" + input + "\n\"\"\"\n The response must be in HTML format")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/math', async (req, res) => {
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
             {"role": "user", "content": ("Solve this math problem in step-by-step: \n\n Math problem: \"\"\" \n" + input + "\n\"\"\"")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/math-pt', async (req, res) => {
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
             {"role": "user", "content": ("Resolva esse problema de matemática: \n\n Problema de matemática: \"\"\" \n" + input + "\n\"\"\"")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/translate-code', async (req, res) => {
    let input;

    if (!verifyIfHasInputBody(req) || !verifyIfHasCodeBody(req)) {
        res.sendStatus(400);
        return;
    }

    input = req.body.input;
    code = req.body.code;

    const isProfane = await openai.createModeration({ input: input });
    const isProfane2 = await openai.createModeration({ input: code });

    if (isProfane.data.results[0].flagged || isProfane2.data.results[0].flagged) {
        res.sendStatus(400);
        return;
    }
 
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
             {"role": "user", "content": ("Translate the code below to " + code + " code: \n\n Code: \"\"\" \n" + input + "\n\"\"\"")},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/chat', async (req, res) => {
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
             {"role": "user", "content": (input)},   
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            user: uuidv4(),
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].message.content });
    }
    catch (e) {
        console.log(e);
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

function verifyIfHasCodeBody(req) {
    if (req.body) {
        if (req.body.code) {
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