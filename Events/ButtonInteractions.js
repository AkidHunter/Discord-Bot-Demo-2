const { ButtonInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction, client) {
    interaction.deferUpdate;
    if (!interaction.isButton()) return;
    //
    const Button = client.buttons.get(interaction.customId);

    if (interaction.isButton() && !Button) return;

    if (!Button)
      return await interaction.reply({
        content: "This button is outdated or not exist.",
        ephemeral: true,
      });

    Button.execute(interaction, client);
  },
};
