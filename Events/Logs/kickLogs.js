// KICK LOGS
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
 // check discord dunkey
module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   */
  async execute(member, interaction, client) {
    const { guild } = member;
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });
    const kickLog = fetchedLogs.entries.first();
    if (!kickLog) return "Invalid";
    console.log(kickLog)
    const { executor, target } = kickLog;
    if (target.id == member.user.id) {
      let logEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Kicked User`)
        .setFooter({
          text: member.guild.name,
          iconURL: member.guild.iconURL(),
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
            name: "**[**`*️⃣`**] Kick Reason**",
            value: `**(** ` + "`" + kickLog.reason + "` **)**",
            inline: false,
          },
          {
            name: "**[**`📅`**] Kick Date**",
            value:
              `**(** ` +
              "`" +
              moment(kickLog.createdAt).format("LLLL") +
              "` **)**",
            inline: false,
          }
        );
      try {
        await member.guild.channels.cache
          .get(`${config.logChannels.userKicked}`)
          .send({ embeds: [logEmbed] });
      } catch (error) {
        console.log(error);
      }
    } else {
      let logEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Kicked User`)
        .setFooter({
          text: member.guild.name,
          iconURL: member.guild.iconURL(),
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
            name: "**[**`*️⃣`**] Kick Reason**",
            value: `**(** ` + "`" + kickLog.reason + "` **)**",
            inline: false,
          },
          {
            name: "**[**`📅`**] Kick Date**",
            value:
              `**(** ` +
              "`" +
              moment(kickLog.createdAt).format("LLLL") +
              "` **)**",
            inline: false,
          }
        );
      await member.guild.channels.cache
        .get(`${config.logChannels.userKicked}`)
        .send({ embeds: [logEmbed] });
    }
  },
};
