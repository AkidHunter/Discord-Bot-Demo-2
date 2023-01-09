const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Client,
} = require("discord.js");

const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sends the command list!"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, args) {
    const dirs = fs.readdirSync("./commands");
    const slashCommands = await client.application.commands.fetch();
    const embedMsg = new EmbedBuilder()
      .setTitle("Help Command")
      .setDescription(
        "Select an option to get the command list of. Only one option can be selected."
      )
      .addFields(
        {
          name: ":file_folder: Total Command Categories",
          value: `<:reply:1002181954864681030> ${dirs.length}`,
          inline: true,
        },
        {
          name: ":open_file_folder: Total Slash Commands",
          value: `<:reply:1002181954864681030> ${slashCommands.size}`,
          inline: true,
        }
      )
      .setColor("0x2F3136");

    let helpMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("helpMenu")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Select a category")
    );

    fs.readdirSync("./commands").forEach((command) => {
      helpMenu.components[0].addOptions({
        label: `${command}`,
        description: `Command list for ${command}`,
        value: `${command}`,
      });
    });

    await interaction.reply({ embeds: [embedMsg], components: [helpMenu], ephemeral: true });
  },
};
