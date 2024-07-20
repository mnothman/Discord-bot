const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Creates a new role')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the role in HEX (e.g., #FF0000)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('permissions')
                .setDescription('Comma-separated list of permissions (e.g., "ADMINISTRATOR,KICK_MEMBERS")')
                //permissions? *	string	total permissions for the user in the guild (excludes overwrites and implicit permissions)
                // Guild object -> guild structure: https://discord.com/developers/docs/resources/guild#guild-object
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.member;
        const guild = interaction.guild;

        if (member.id !== guild.ownerId && !member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const roleName = interaction.options.getString('name');
        const roleColor = interaction.options.getString('color') || '#FFFFFF';
        const permissionsString = interaction.options.getString('permissions') || '';
        const permissionsArray = permissionsString.split(',').map(perm => perm.trim().toUpperCase());

        try {
            const newRole = await guild.roles.create({
                name: roleName,
                color: roleColor,
                permissions: permissionsArray,
                reason: `Role created by ${interaction.user.tag}`
            });

            await interaction.reply(`Successfully created the role ${newRole.name} with color ${newRole.color} and permissions ${permissionsArray.join(', ')}`);
        } catch (error) {
            console.error('Error creating role:', error);
            await interaction.reply('An error occurred while creating the role.');
        }
    },
};
