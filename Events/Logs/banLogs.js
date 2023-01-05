// BAN LOGS
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "guildBanAdd",
  once: true,
    /**
     * @param {GuildBan} interaction
     */ 
  async execute(ban, interaction, client) {
    const { guild } = interaction;
    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd,
    });
    const banLog = fetchedLogs.entries.first();
    if (!banLog) return "Invalid";
    const { executor, target } = banLog;
    if (target.id == ban.user.id) {
      let logEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Banned User`)
        .setFooter({
          text: ban.guild.name,
          iconURL: ban.guild.iconURL(),
        })
        .setTimestamp()
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
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
            name: "**[**`*️⃣`**] Banned Reason**",
            value: `**(** ` + "`" + banLog.reason + "` **)**",
            inline: false,
          },
          {
            name: "**[**`📅`**] Banned Date**",
            value:
              `**(** ` +
              "`" +
              moment(banLog.createdAt).format("LLLL") +
              "` **)**",
            inline: false,
          }
        );
      try {
        await ban.guild.channels.cache
          .get(`${config.logChannels.userBanned}`)
          .send({ embeds: [logEmbed] });
      } catch (error) {
        console.log(error);
      }
    } else {
      let logEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Banned User`)
        .setFooter({
          text: ban.guild.name,
          iconURL: ban.guild.iconURL(),
        })
        .setTimestamp()
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
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
            name: "**[**`*️⃣`**] Banned Reason**",
            value: `**(** ` + "`" + banLog.reason + "` **)**",
            inline: false,
          },
          {
            name: "**[**`📅`**] Banned Date**",
            value:
              `**(** ` +
              "`" +
              moment(banLog.createdAt).format("LLLL") +
              "` **)**",
            inline: false,
          }
        );
      await ban.guild.channels.cache
        .get(`${config.logChannels.userBanned}`)
        .send({ embeds: [logEmbed] });
    }
  },
};
