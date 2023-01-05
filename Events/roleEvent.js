const { SelectMenuInteraction } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    on: true,
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, member, customId } = interaction;
        if (!interaction.isStringSelectMenu() || !customId.startsWith('rolemenu')) return;
        await interaction.deferUpdate();
        if (!interaction.values[0]) return interaction.followUp({ content: 'No changes made! Re-select a role you already have / don`t have for removal / addition!', ephemeral: true }).catch(console.error);
        const role = await guild.roles.fetch(interaction.values[0]).catch(console.error);
        if (member.roles.cache.has(interaction.values[0])) return interaction.followUp({ content: `You have removed the ${role} Role from yourself.`, ephemeral: true }) && member.roles.remove(interaction.values[0]).catch(console.error)
        else interaction.followUp({ content: `You have given yourself the ${role} Role.`, ephemeral: true }) && member.roles.add(interaction.values[0]).catch(console.error);
    },
};