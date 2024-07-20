const { Client, Collection, GatewayIntentBits, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { handleProfanity } = require('./commands/Profanitytimeout.js');
const { handleSuspiciousLinks } = require('./commands/MessageFilter.js');
const { handleSpam } = require('./commands/SpamPrevention.js');
const { handleUnsafeSearch, handleUnsafeSearchError, isUnsafeContent } = require('./commands/UnsafeSearch.js');
const { Translate } = require('@google-cloud/translate').v2;
const langdetect = require('langdetect');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();
const express = require('express');
const axios = require('axios');

const { clientId, clientSecret, port } = require('./config.json');

const app = express();

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
	if (message.author.bot) return; //ignore bot messages

	const profanityDeleted = await handleProfanity(message);

	if (!profanityDeleted) {
		handleSuspiciousLinks(message);
		handleSpam(message);

		if (message.content.toLowerCase().endsWith('!search')) {
			const query = message.content.slice(0, -7).trim();
			const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
			const cx = process.env.GOOGLE_CUSTOM_SEARCH_UNIQUE_ID;
			const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&safe=active`;

			console.log('Search URL:', searchUrl);

			try {
				const response = await axios.get(searchUrl);
				if (response.data.items && response.data.items.length > 0) {
					const firstResult = response.data.items[0];
					if (isUnsafeContent(firstResult.title) || isUnsafeContent(firstResult.snippet)) {
						handleUnsafeSearch(message);
					} else {
						const note = '\n\n*Note: Some searches may be different due to Google Safe Search being active.*';
						const shortAnswer = `${firstResult.title}\n${firstResult.snippet}${note}`;
						const fullAnswer = `${firstResult.title}\n${firstResult.snippet}\n${firstResult.link}`;

						const row = new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId('showMore')
								.setLabel('Show More')
								.setStyle(ButtonStyle.Primary)
						);

						const sentMessage = await message.reply({ content: shortAnswer, components: [row] });

						const filter = i => i.customId === 'showMore' && i.user.id === message.author.id;
						const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

						collector.on('collect', async i => {
							if (i.customId === 'showMore') {
								await i.update({ content: fullAnswer, components: [] });
							}
						});

						collector.on('end', collected => {
							if (collected.size === 0) {
								sentMessage.edit({ components: [] });
							}
						});
					}
				} else {
					message.reply('No results found.');
				}
			} catch (error) {
				if (error.response && error.response.data.error.errors.some(e => e.domain === 'global' && e.reason === 'invalidArgument')) {
					handleUnsafeSearch(message);
				} else {
					console.error('Error performing search:', error);
					console.error('Response data:', error.response ? error.response.data : 'No response data');
					message.reply('An error occurred while performing the search.');
				}
				// translation logic (need !translate at the end of the message)
			}
		} else if (message.content.toLowerCase().endsWith('!translate')) {
			const contentToTranslate = message.content.slice(0, -10).trim(); // Remove the '!translate' part
			const detectedLanguages = langdetect.detect(contentToTranslate);
			const detectedLanguage = Array.isArray(detectedLanguages) && detectedLanguages.length > 0 ? detectedLanguages[0].lang : 'en';

			if (detectedLanguage !== 'en') {
				try {
					const [translation] = await translate.translate(contentToTranslate, 'en');
					message.reply(`Detected language: ${detectedLanguage}. Translated to English: ${translation}`);
				} catch (error) {
					console.error('Error translating:', error);
					message.reply('An error occurred while translating the message.');
				}
			}
		}
	}
});

