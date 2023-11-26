import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import { handleProfanity } from './Profanitytimeout.js';

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

//.env here
client.login(process.env.DISC_TOKEN);
console.log("Connection running");


client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // Use the handleProfanity function from profanity.js
    handleProfanity(message);

    // Add other event handlers as needed
});

