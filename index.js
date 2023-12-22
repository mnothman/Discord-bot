import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import { handleProfanity } from './Profanitytimeout.js';
// import MusicPlayer from './MusicFunctionality.js';
import { handleSuspiciousLinks } from './MessageFilter.js'; 
import { handleSpam } from './SpamPrevention.js';

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

//.env here
client.login(process.env.DISC_TOKEN);
console.log("Connection running");



// const musicPlayer = new MusicPlayer();


client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    handleProfanity(message);
    handleSuspiciousLinks(message);
    handleSpam(message);


});

//     // Handle music commands
//     if (message.content.startsWith('!play')) {
//         const args = message.content.split(' ');
//         const url = args[1];

//         if (!url) {
//             message.channel.send('Please provide a valid YouTube URL.');
//             return;
//         }

//         const voiceChannel = message.member.voice.channel;

//         if (!voiceChannel) {
//             message.channel.send('You must be in a voice channel to use this command.');
//             return;
//         }

//         // Join the voice channel if not already in it
//         if (!musicPlayer.connection) {
//             musicPlayer.joinChannel(voiceChannel);
//         }

//         // Enqueue the requested song
//         musicPlayer.enqueue(url);
//     }


//     // Add other event handlers as needed
// });

