const { Client, MessageContextMenuCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ApplicationCommandType, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("removearole")
        .setType(ApplicationCommandType.Message),
    /**
     *
     * @param {Client} client
     * @param {MessageContextMenuCommandInteraction} interaction
     * @returns

     */
    async execute(interaction, client) {
        const { targetMessage, member, createdTimestamp, user } = interaction;
        const targetMenu = targetMessage.components[0]?.components[0].type === ComponentType.StringSelect ? new StringSelectMenuBuilder(targetMessage.components[0].components[0].toJSON()) : undefined;
        const yesNoButtons = (buttonIds) => new ActionRowBuilder().addComponents([
            new ButtonBuilder().setStyle(ButtonStyle.Danger).setEmoji('🗑️').setCustomId(buttonIds[0]).setLabel('Delete'),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('❌').setCustomId(buttonIds[1]).setLabel('Cancel')
        ]);
        if ((targetMessage.author.id != client.user?.id) || !targetMenu) return interaction.reply({ content: `${member} This is not a Role Menu from <@${client.user?.id}>!`, ephemeral: true }).catch(console.error);

        const customIds = [`${user.id}delete${createdTimestamp}`, `${user.id}cancel${createdTimestamp}`];
        if (targetMenu.options.length == 1) return await interaction.reply({ content: `${member} **Delete Role Menu?**`, components: [yesNoButtons(customIds)], ephemeral: true })
            .then(async message => await message.awaitMessageComponent({ filter: i => customIds.includes(i.customId), componentType: ComponentType.Button, time: 60000, max: 1 })
                .then(interaction => {
                    if (interaction.customId.includes('delete')) return interaction.update({ embeds: [new EmbedBuilder().setTimestamp().setColor("Green").setTitle('Removed!').setDescription(`Successfully deleted the Role Menu!`)], content: '', components: [], ephemeral: true }).catch(console.error)
                        && targetMessage.delete().catch(console.error);
                    else return interaction.update({ content: '', embeds: [new EmbedBuilder().setTimestamp().setColor("Red").setTitle('Cancelled').setDescription("No changes have been made!")], components: [new ActionRowBuilder().setComponents(...yesNoButtons(customIds).components.map(button => button?.setDisabled()))] }).catch(console.error);
                }))
            .catch(console.error);

        await interaction.reply({ content: `${member} **Select the role you would like to remove from the Menu!**`, components: [new ActionRowBuilder().addComponents([new StringSelectMenuBuilder().setMinValues(0).setMaxValues(1).setPlaceholder("Select the role to remove from this Menu!").setCustomId(`${user.id}remove${createdTimestamp}`).setOptions(targetMenu.options)])], ephemeral: true })
            .then(async message => await message.awaitMessageComponent({ filter: i => i.customId == `${user.id}remove${createdTimestamp}`, componentType: ComponentType.StringSelect, time: 60000, max: 1 })
                .then(interaction => interaction.update({ embeds: [new EmbedBuilder().setTimestamp().setColor("Green").setTitle('Removed!').setDescription(`<@&${interaction.values[0]}> has been removed from this menu!`)], content: '', components: [], ephemeral: true }).catch(console.error)
                    && targetMenu.options.splice(targetMenu.options.findIndex(e => e.data?.value == interaction.values[0]), 1) && targetMessage.edit({ components: [new ActionRowBuilder().addComponents(targetMenu)] }).catch(console.error)))
            .catch(console.error);
    },
};