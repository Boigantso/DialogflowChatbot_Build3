const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

const projectId = 'Build3_India'; 
const sessionId = uuid.v4();
const languageCode = 'en-US';

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

app.post('/webhook', async (req, res) => {
    const query = req.body.queryResult.queryText;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        res.json({
            fulfillmentText: result.fulfillmentText,
        });
    } catch (error) {
        console.error('ERROR:', error);
        res.status(500).send('Error occurred');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
