const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};


//play.js
// import pkg, { SlashCommandBuilder } from 'discord.js';
// const { MessageActionRow, MessageSelectMenu } = pkg;

// import Command from './Command.js';

// export default class PlayCommand extends Command {
//   constructor() {
//     super('play');
//     this.data = new SlashCommandBuilder()
//       .setName('play')
//       .setDescription('play music from selected source')
//   }

//   async execute(message, args) {
//     if (!this.requiresVoice(message)) {
//       return;
//     }
//     console.log('play command executing');
//     const row = new MessageActionRow()
//       .addComponents(
//         new MessageSelectMenu()
//           .setCustomId('select')
//           .setPlaceholder('Select a source')
//           .addOptions([
//             {
//               label: 'Bandcamp',
//               value: 'bandcamp',
//             },
//             {
//               label: 'Soundcloud',
//               value: 'soundcloud',
//             },
//             //additional sources
//           ])
//       );

//     const reply = await message.reply({
//       content: 'Please select a music source:',
//       components: [row],
//     });

//     // Collect the user's selection
//     const filter = (interaction) =>
//       interaction.customId === 'select' && interaction.user.id === message.author.id;

//     const collector = message.channel.createMessageComponentCollector({
//       filter,
//       time: 15000, // Adjust the time limit as needed
//     });

//     collector.on('collect', async (interaction) => {
//       const selectedSource = interaction.values[0];
//       await interaction.deferUpdate();

//       // Handle the selected source and proceed with fetching and playing music
//       // Implement the logic based on the selected source (e.g., link or search term)
//       // You may need to use external APIs (e.g., Soundcloud API) to fetch music details

//       // After handling, you can stop the collector and edit the original reply
//       collector.stop();
//       await reply.edit({ content: 'Music fetched and playing!', components: [] });
//     });

//     collector.on('end', (collected) => {
//       if (collected.size === 0) {
//         reply.edit({ content: 'Music selection timed out.', components: [] });
//       }
//     });
//   }
// }
