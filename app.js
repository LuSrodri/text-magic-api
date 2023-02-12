var express = require('express');
var app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/text-to-emoji', async (req, res) => {
    let input;

    if(!verifyIfHasInputBody(req)) {
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
            prompt: ("Write \"" + input + "\" in emoji"),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/explain-code', async (req, res) => {
    let input;

    if(!verifyIfHasInputBody(req)) {
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
            model: "code-davinci-002",
            prompt: ("Explain the code below:\n" + input),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.statusCode = 200;
        res.send({ output: response.data.choices[0].text });
    }
    catch {
        res.sendStatus(400);
    }

});

app.post('/fixes-code', async (req, res) => {
    let input;

    if(!verifyIfHasInputBody(req)) {
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
            model: "code-davinci-002",
            prompt: ("Rewrite the code below fixing the possible mistakes:\n" + input),
            temperature: 0.1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
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
    console.log('App listening on port 3000!');
});