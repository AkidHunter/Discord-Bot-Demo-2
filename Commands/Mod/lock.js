const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const DB = require("../../schemas/lock");
const ms = require("ms");
const { PLAYERID } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock a channel")
        .addStringOption((options) => options
            .setName("time")
            .setDescription("Expire date for this lockdown (1m, 1h, 1d)")
            .setRequired(false)
        )
        .addStringOption((options) => options
            .setName("reason")
            .setDescription("Provide a reason for this lockdown.")
            .setRequired(false)
        ),
        
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel, options } = interaction;

    const Reason = options.getString("reason") || "no specified reason";

    const Embed = new EmbedBuilder();

    if (!channel.permissionsFor(PLAYERID).has("SendMessages"))
      return interaction.reply({
        embeds: [
          Embed.setColor("FF0000").setDescription(
            "⛔ | This channel is already locked."
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(PLAYERID, {
        SendMessages: false,
  });

    interaction.reply({
      embeds: [
        Embed.setColor("FF0000").setDescription(
          `🔒 | This channel is now under lockdown for: ${Reason}`
        ),
      ]
    });
    const Time = options.getString("time");
    if (Time) {
      const ExpireDate = Date.now() + ms(Time);
      DB.create({ GuildID: PLAYERID, ChannelID: channel.id, Time: ExpireDate });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(PLAYERID, 
            PermissionFlagsBits.SendMessages = null,
        );
        interaction
          .editReply({
            embeds: [
              Embed.setDescription(
                "🔓 | The lockdown has been lifted"
              ).setColor("FF0000"),
            ], ephemeral: true,
          })
          .catch(() => {});
        await DB.deleteOne({ ChannelID: channel.id });
      }, ms(Time));
    }
  },
};