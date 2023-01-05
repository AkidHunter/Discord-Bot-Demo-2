// MESSAGE DELETE
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "messageDelete",
    /**
     * @param {Message} interaction
     */
  async execute(message, interaction, client) {
    const { guild } = interaction;

    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete,
    });
    const messageLog = fetchedLogs.entries.first();
    if (!messageLog) return "Invalid";
    const { executor, target } = messageLog;
    let content = message.content == null ? "EMBED" : `${message.content}`;
    let logEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle(`Message Deleted`)
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTimestamp()
      .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "**[**`👤`**] User**",
          value: `**(** ` + "`" + target.tag + "` **)**",
          inline: false,
        },
        {
          name: "**[**`🆔`**] User ID**",
          value: `**(** ` + "`" + target.id + "` **)**",
          inline: false,
        },
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
          name: "**[**`*️⃣`**] Message Content**",
          value: `**(** ` + "`" + `${content}` + "` **)**",
          inline: false,
        },
        {
          name: "**[**`📅`**] Deletion Date**",
          value:
            `**(** ` +
            "`" +
            moment(messageLog.createdAt).format("LLLL") +
            "` **)**",
          inline: false,
        }
      );
    try {
      await message.guild.channels.cache
        .get(`${config.logChannels.messageDelete}`)
        .send({ embeds: [logEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
