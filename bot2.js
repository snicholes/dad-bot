let Discord = require('discord.io');
let auth = require('./auth.json');

let bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('message', respond);

function respond(user, userID, channelID, message, evt) {
    if (message.toLowerCase().includes('i\'m ') && user !== 'Hi-Im-DadBot') { // if message includes "i'm"
        let args = message.substring(message.toLowerCase().indexOf('i\'m')).split(' '); // get each argument
        args = args.splice(1); // remove "i'm"

        let includesTerms = ['so','very','really','genuinely','extremely','not'];

        if ((includesTerms.includes(args[0])) && args.length>1) {
            bot.sendMessage({
                to:channelID,
                message:`Hi ${args[0]} ${args[1]}, I'm Dad.`
            });
        } else {
            bot.sendMessage({
                to:channelID,
                message:`Hi ${args[0]}, I'm Dad.`
            });
        }
    }
}