// ping.cjs
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverping')
    .setDescription('Check the bot\'s ping.'),
  async execute(interaction) {
    const apiPing = Math.round(interaction.client.ws.ping);
    const messagePing = Date.now() - interaction.createdTimestamp;

    interaction.reply(`The **API** is ${apiPing}ms. The **message** ping is '${messagePing}ms'.`);
  },
};
