// UNBAN LOGS
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "guildBanRemove",
  once: true,
  /**
   * @param {GuildMember} interaction
   */ 
  async execute(ban, interaction, client) {
    const { guild } = interaction;
    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove,
    });
    const banLog = fetchedLogs.entries.first();
    if (!banLog) return "Invalid";
    const { executor, target } = banLog;
    if (target.id == ban.user.id) {
      let logEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Unbanned User`)
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
            name: "**[**`📅`**] Unbanned Date**",
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
          .get(`${config.logChannels.userUnBanned}`)
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
            name: "**[**`📅`**] Unbanned Date**",
            value:
              `**(** ` +
              "`" +
              moment(banLog.createdAt).format("LLLL") +
              "` **)**",
            inline: false,
          }
        );
      await ban.guild.channels.cache
        .get(`${config.logChannels.userUnBanned}`)
        .send({ embeds: [logEmbed] });
    }
  },
};
