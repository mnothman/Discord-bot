const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Adds a role to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to whom the role will be added')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to be added')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const guild = interaction.guild;

        if (member.id !== guild.ownerId && !member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const guildMember = await interaction.guild.members.fetch(user.id);

        await guildMember.roles.add(role);
        await interaction.reply(`Successfully added ${role.name} to ${user.tag}`);
    },
};
