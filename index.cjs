const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { handleProfanity } = require('./Profanitytimeout.js');
const { handleSuspiciousLinks } = require('./MessageFilter.js');
const { handleSpam } = require('./SpamPrevention.js');
const { Translate } = require('@google-cloud/translate').v2;
const langdetect = require('langdetect');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();
const express = require('express');
// const { port } = require('./config.json');
// const { request } = require('undici');
const axios = require('axios');

const { clientId, clientSecret, port } = require('./config.json');

const app = express();


// app.get('/', (request, response) => {
//   console.log(`The access code is: ${request.query.code}`);
// 	return response.sendFile('index.html', { root: '.' });
// });

app.use(express.static(path.join(__dirname, 'frontend')));


app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();
      const userResult = await request('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			console.log(await userResult.body.json());
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}
	}

	return response.sendFile('index.html', { root: '.' });
});
// 			console.log(oauthData);
// 		} catch (error) {
// 			// NOTE: An unauthorized token will not throw an error
// 			// tokenResponseData.statusCode will be 401
// 			console.error(error);
// 		}
// 	}

// 	return response.sendFile('index.html', { root: '.' });
// });


app.listen(port, () => console.log(`App listening at http://localhost:${port}`));




//project was originally in js, changed to cjs

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
//https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files

console.log("running cjs index file");

client.once(Events.ClientReady, readyClient => { //new
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(process.env.DISC_TOKEN);
console.log("Connection running");

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATION_API_KEY, 
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const profanityDeleted = await handleProfanity(message);

    if (!profanityDeleted) {
        handleSuspiciousLinks(message);
        handleSpam(message);

        // Translation logic here (check if profanity was not deleted)
        const detectedLanguages = langdetect.detect(message.content);
        const detectedLanguage = Array.isArray(detectedLanguages) && detectedLanguages.length > 0
            ? detectedLanguages[0].lang
            : 'en';

        if (detectedLanguage !== 'en') {
            try {
                const [translation] = await translate.translate(message.content, 'en');
                message.reply(`Detected language: ${detectedLanguage}. Translated to English: ${translation}`);
            } catch (error) {
                console.error('Error translating:', error);
                message.reply('An error occurred while translating the message.');
            }
        }
    }
});

  //changed due to profanity and translation clashing
// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;

//     handleProfanity(message);
//     handleSuspiciousLinks(message);
//     handleSpam(message);

//     //potentially make a translate as well where it takes in input and translates (check cost of api)

//     //NEED TO FIX THE LANGAUGE DETECTION IT DOESNT FULLY WORK
//     const detectedLanguages = langdetect.detect(message.content);

//     const detectedLanguage = Array.isArray(detectedLanguages) && detectedLanguages.length > 0
//       ? detectedLanguages[0].lang
//       : 'en';
  
//     if (detectedLanguage !== 'en') {
//       try {
//         const [translation] = await translate.translate(message.content, 'en');
//           message.reply(`Detected language: ${detectedLanguage}. Translated to English: ${translation}`);
//       } catch (error) {
//         console.error('Error translating:', error);
//         message.reply('An error occurred while translating the message.');
//       }
//     }
//   });


//new

  //will have an enable/disable for things like translate/profanity etc, will also have a place where welcome messages can be sent

//manage server permission allows a user to add bots to server, so when the user logs into our dashboard it will display the servers that they have proper permissions in AND not servers that the bot is already in. 
//if bot is not already in server there will be a button that says join, if the bot is in that server it will say configure (so we can figure where profanity/link/translate is allowed)


// import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
// import { handleProfanity } from './Profanitytimeout.js';
// import { handleSuspiciousLinks } from './MessageFilter.js'; 
// import { handleSpam } from './SpamPrevention.js';
// import dotenv from 'dotenv';
// dotenv.config();

// //new
// import * as fs from 'node:fs';
// import * as path from 'node:path';
// // const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const client = new Client({
//     intents: [
//         GatewayIntentBits.GuildMembers,
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.DirectMessages,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//         GatewayIntentBits.GuildVoiceStates,
//     ],
// });
// //https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files


// client.once(Events.ClientReady, readyClient => { //new
// 	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });
// client.login(process.env.DISC_TOKEN);
// console.log("Connection running");

// client.commands = new Collection();


// // const spotifyApi = new SpotifyWebApi({
// //     clientId: process.env.SPOTIFY_CLIENT_ID,
// //     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
// //     redirectUri: process.env.SPOTIFY_CLIENT_DISCORD,
// //   });
  
// // const commands = [
// //     new PlayCommand(),
// //     // Add other commands as needed
// //   ];

// const foldersPath = path.join(__dirname, 'commands');

// // Read the list of folders in the commands directory
// const commandFolders = fs.readdirSync(foldersPath);




// // Loop through each folder
// for (const folder of commandFolders) {
//     // Create the path to the specific command folder
//     const commandsPath = path.join(foldersPath, folder);

//     // Read the list of command files in the folder
//     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//     // Loop through each command file
//     for (const file of commandFiles) {
//         // Create the full path to the command file
//         const filePath = path.join(commandsPath, file);
    
//         // Require the command module using CommonJS require
//         const commandModule = require(filePath);
    
//         // Check if the required properties exist
//         if (commandModule && 'data' in commandModule && 'execute' in commandModule) {
//             // Set a new item in the Collection with the key as the command name and the value as the exported module
//             client.commands.set(commandModule.data.name, commandModule);
//         } else {
//             console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//         }
//     }
//     // for (const file of commandFiles) {
//     //     // Create the full path to the command file
//     //     const filePath = path.join(commandsPath, file);

//     //     // Import the command module
//     //     import(filePath)
//     //         .then(command => {
//     //             // Check if the required properties exist
//     //             if ('data' in command && 'execute' in command) {
//     //                 // Set a new item in the Collection with the key as the command name and the value as the exported module
//     //                 client.commands.set(command.data.name, command);
//     //             } else {
//     //                 console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//     //             }
//     //         })
//     //         .catch(error => {
//     //             console.error(`Error importing command at ${filePath}: ${error.message}`);
//     //         });
//     // }
// }

// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = interaction.client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}
// });

// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;

//     handleProfanity(message);
//     handleSuspiciousLinks(message);
//     handleSpam(message);

//     if (message.content.toLowerCase() === "/ping") {
//         message.reply("The **API** is " + client.ws.ping + "ms. " + 'The **message** ping is ' + "'" + (Date.now() - message.createdTimestamp) + "ms'.")
//     };

// //implement nuking a discord channel where you can do !nuke and then it deletes ~300 messages (i think 300 is the max currently)

//     // make an award place, where every user in a server can give an award to a user (not themselves) every 3 days. have tiers 1-5 for awards. Once you reach 3+ level, the owner can set rules like being able to bypass profanity,...
//     //... links, spam etc
//     //to make sure a command is from owner of server (special permissions), do if(message.author.id !== confid.ownerID) return;
//     //to have a music bot, need to do things like take meta data from links that are given such as spotify since spotify music files are encrypted and then search for the song on (cant do youtube anymore) something like Soundcloud, Bandcamp, Twitch, Deezer, Vimeo, and Dailymotion. 
//     //MAKE IT TO WHERE A USER CAN GIVE LINK FROM THESE SOURCES, AND ARE ABLE TO ADD IT INTO A PLAYLIST THEY WANT

//     //have an option where commands sent to bot and messages bot has sent are deleted after a certain time. The owner of server can set this setting 

//     //FOR SPOTIFY SPECIFICALLY (NEED TO HAVE SPOTIFY CONNECTED TO DISCORD: SETTINGS->CONNECTIONS->SPOTIFY->LOGIN->TRACK YOURE LISTENING TO APPEARS ON PROFILE)
// //DO THIS FIRST can use the built in spotify functionality in discord, can have functionality such as skip, shuffle, history, restart, resume, pause, volume
// // https://developer.spotify.com/
// //Spotify will pause if your microphone is active for more than 30 seconds, so use push-to-talk or lower your mic's voice sensitivity.

// });
