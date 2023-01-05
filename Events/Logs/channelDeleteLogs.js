// CHANNEL DELETE
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "channelDelete",
  async execute(channel, client) {
    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete,
    });
    const channelLog = fetchedLogs.entries.first();
    if (!channelLog) return "Invalid";
    const { executor, target } = channelLog;
    let logEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle(`Channel Deleted`)
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
          name: "**[**`📅`**] Deletion Date**",
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
        .get(`${config.logChannels.channelDelete}`)
        .send({ embeds: [logEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
