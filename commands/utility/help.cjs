const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands.'),
    async execute(interaction) {
        const commandList = [
            {
                name: 'user',
                description: 'Provides information about the user.',
            },
            {
                name: 'ping',
                description: 'Replies with pong.',
            },
            {
                name: '!translate',
                description: 'Translates the provided text to a specified language.',
            }
            // Other commmands later hard code
        ];

        const formattedList = commandList.map(cmd => `**/${cmd.name}**: ${cmd.description}`).join('\n');

        await interaction.reply(`Available Commands:\n${formattedList}`);
    },
};
