// CHANNEL CREATE
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "channelCreate",
    /**
     * @param {Channel} interaction
     */
  async execute(channel, interaction, client) {
    const { guild } = interaction;
    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate,
    });
    const channelLog = fetchedLogs.entries.first();
    if (!channelLog) return "Invalid";
    const { executor, target } = channelLog;
    let logEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Channel Created`)
      .setFooter({
        text: channel.guild.name,
        iconURL: channel.guild.iconURL(),
      })
      .setTimestamp()
      .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "**[**`👤`**] Executor**",
          value: `**(** ` + "`" + executor.tag + "` **)**",
          inline: false,
        },
        {
          name: "**[**`🆔`**] Executor ID**",
          value: `**(** ` + "`" + executor.id + "` **)**",
          inline: false,
        },
        {
          name: "**[**`*️⃣`**] Channel Name**",
          value: `**(** ` + "`" + channel.name + "` **)**",
          inline: false,
        },
        {
          name: "**[**`📅`**] Creation Date**",
          value:
            `**(** ` +
            "`" +
            moment(channelLog.createdAt).format("LLLL") +
            "` **)**",
          inline: false,
        }
      );
    try {
      await channel.guild.channels.cache
        .get(`${config.logChannels.channelCreate}`)
        .send({ embeds: [logEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
