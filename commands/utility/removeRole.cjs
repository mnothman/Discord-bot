const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Removes a role from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user from whom the role will be removed')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to be removed')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const guild = interaction.guild;

        if (!guild.owner || guild.permissions.includes('MANAGE_GUILD')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const guildMember = await interaction.guild.members.fetch(user.id);

        await guildMember.roles.remove(role);
        await interaction.reply(`Successfully removed ${role.name} from ${user.tag}`);
    },
};