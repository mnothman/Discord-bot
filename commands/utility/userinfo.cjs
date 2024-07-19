const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Select a user')
        .setRequired(true) // Makes it a mandatory option to have (useful later)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(targetUser.id); // Part of guild

    if (!member) {
      return interaction.reply('User not found in the guild.');
    }

    const userInfoEmbed = {
        color: parseInt('0099ff', 16),
        title: `${targetUser.username}'s User Information`,
      thumbnail: {
        url: targetUser.displayAvatarURL({ dynamic: true }),
      },
      fields: [
        { name: 'User ID', value: targetUser.id, inline: true },
        { name: 'Discord Tag', value: targetUser.tag, inline: true },
        { name: 'Account Creation Date', value: targetUser.createdAt.toDateString(), inline: true },
        { name: 'Join Date', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: false },
      ],
    };

    if (targetUser.presence) {
      userInfoEmbed.fields.push(
        { name: 'Status', value: targetUser.presence.status, inline: true },
        { name: 'Activity', value: targetUser.presence.activities[0] ? targetUser.presence.activities[0].name : 'None', inline: true },
      );
    } else {
      userInfoEmbed.fields.push(
        { name: 'Status', value: 'Unknown', inline: true },
        { name: 'Activity', value: 'None', inline: true },
      );
    }

    interaction.reply({ embeds: [userInfoEmbed] });
  },
};