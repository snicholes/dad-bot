let Discord = require('discord.io');
let AWS = require('aws-sdk'),
    region = "us-east-2",
    secretName = "arn:aws:secretsmanager:us-east-2:543754817282:secret:dad-bot-tkn-78R6ST",
    secret,
    decodedBinarySecret;

let client = new AWS.SecretsManager({
    region: region
});

getMsg();

async function getMsg() {
    await client.getSecretValue({SecretId: secretName}, function(err, data) {
        if (err) {
            if (err.code === 'DecryptionFailureException')
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                throw err;
            else if (err.code === 'InternalServiceErrorException')
                // An error occurred on the server side.
                throw err;
            else if (err.code === 'InvalidParameterException')
                // You provided an invalid value for a parameter.
                throw err;
            else if (err.code === 'InvalidRequestException')
                // You provided a parameter value that is not valid for the current state of the resource.
                throw err;
            else if (err.code === 'ResourceNotFoundException')
                // We can't find the resource that you asked for.
                throw err;
        }
        else {
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
        }
    });

    let bot = new Discord.Client({
        token: secret.token,
        autorun: true
    });
    
    bot.on('message', respond);
    
    function respond(user, userID, channelID, message, evt) {
        if (message.toLowerCase.includes('i\'m ')) { // if message includes "i'm"
            let args = message.substring(message.toLowerCase().indexOf('i\'m')).split(' '); // get each argument
            args = args.splice(1); // remove "i'm"
    
            let includesSo = args[0].toLowerCase().startsWith('so');
            let includesVery = args[0].toLowerCase().startsWith('very');
    
            if (includesSo || includesVery) {
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
}