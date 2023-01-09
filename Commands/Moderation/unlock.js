const { CommandInteraction, SlashCommandBuilder, EmbedBuilder, color } = require("discord.js");
const DB = require("../../schemas/lock");
const { PLAYERID } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock a channel"),
    /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel } = interaction;

    const Embed = new EmbedBuilder();

    if (channel.permissionsFor(PLAYERID).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("Color.RED").setDescription(
            "⛔ | This channel is not locked"
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(PLAYERID, {
      SendMessages: null,
    });

    await DB.deleteOne({ ChannelID: channel.id });

    interaction.reply({
      embeds: [
        Embed.setColor("Color.GREEN").setDescription(
          "🔓 | Lockdown has been lifted."
        ),
      ], ephemeral: true,
    });
  },
};