const SlackBot = require('slackbots');
const axios = require('axios')
const dotenv = require('dotenv')
const https = require('https')

dotenv.config()

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'dipNLP'
})

// Start Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    }

    bot.postMessageToChannel(
        'random',
        'Talk to the Qlik NL Engine',
        params
    );
})

// Error Handler
bot.on('error', (err) => {
    console.log(err);
})

// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }
    handleMessage(data.text);
})

// Response Handler
function handleMessage(message) {
    // if(message.includes(' discount')) {
    //     inspireMe(message)
    // } else if(message.includes(' random joke')) {
    //     randomJoke()
    // } else if(message.includes(' help')) {
    //     runHelp()
    // }
    inspireMe(message)
}

// inspire Me
function inspireMe(val) {
    const temp_new = val
    const data = JSON.stringify({"text":temp_new,"app":{"id":"daf3a831-2437-45ca-95c3-928adfd2e6d9","name":"ABC Sales"}, "disableConversationContext":true})
    const options = {
   hostname: 'open-lib-services.eu.qlik-stage.com',
   port: 443,
   path: '/api/v1/nl/query',
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer eyJhbGciOiJFUzM4NCIsImtpZCI6IjYwM2MzZjE0LWMzNjItNDMyYi04MWE1LTA2Nzc5MmZlNjM4YyIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoieHJwQzEzRm5qZW5CYy1taEJHOThhaDJxTmxmbXdqOFgiLCJqdGkiOiI2MDNjM2YxNC1jMzYyLTQzMmItODFhNS0wNjc3OTJmZTYzOGMiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoid0VxVEhpWFZFcFZyWUNZRU1CeWJ4T0tGd1dMS1N5VUwifQ.hCdqEZIoSSX6a4Gm8HEbL55pOw4bDqnSSIXQo5b7LWusvkrsR4IFwQFRyN-rhbE6XO2oartpZ4XWpiLfAutuyO9zoEHWUB49YpS6cGt6ggibI2WiF6AaL3xEryUxsonb',
     'qlik-web-integration-id': 'XXcljARnWPJpCqo2finVsAVBbqHLfXo1',
   },

 }

 const req = https.request(options, res => {
    res.setEncoding('utf8');
   // console.log(`statusCode: ${res.statusCode}`)
    
    res.on('data', d=>{
       // console.log(d)
        const myobj = JSON.parse(d)

        if('narrative' in myobj.conversationalResponse.responses[0]){
        const temp = myobj.conversationalResponse.responses[0].narrative.text
        bot.postMessageToChannel(
            'random',
            `:zap: ${temp}`)
    }
    else if('imageUrl' in myobj.conversationalResponse.responses[0]){
        const img = myobj.conversationalResponse.responses[0].imageUrl
        //const text_r = myobj.conversationalResponse.responses[1].narrative.text
        // var textbox3 = document.getElementById('val1');
        // textbox3.value = textbox3.value + '\n' + text_r + '\n' + '\n' + 'Here is a visualization' + '\n' + "https://open-lib-services.eu.qlik-stage.com/"+img;
        bot.postMessageToChannel(
            'random',
            `:zap: ${"https://open-lib-services.eu.qlik-stage.com"+img}`)
    }
    // else {
    //     const temp_new = myobj.conversationalResponse.responses[0].followupSentence
    //     //const len = app_data.length
    //     // for(var i=0;i<len;i++){
    //     //     const temp_d = app_data[i].name
    //     //     bot.postMessageToChannel(
    //     //     'random',
    //     //     `:zap: ${temp_d}`)
    //     // }
    //      bot.postMessageToChannel(
    //         'random',
    //         `:zap: ${temp_new}`)
        
    //  }
    })
 })



 req.on('error', error =>{
    console.error(error)
 })



 //const req = https.request(options)

req.write(data)
 req.end()

}

// Random Joke
function randomJoke() {
    axios.get('https://api.chucknorris.io/jokes/random')
      .then(res => {
            const joke = res.data.value;

            const params = {
                icon_emoji: ':smile:'
            }
        
            bot.postMessageToChannel(
                'random',
                `:zap: ${joke}`,
                params
            );

      })
}

// Show Help
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        'random',
        `Type *@dipNLP* with *inspire me* to get an inspiring techie quote, *random joke* to get a Chuck Norris random joke and *help* to get this instruction again`,
        params
    );
}
