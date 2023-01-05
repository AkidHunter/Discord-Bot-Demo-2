// USER TIMEOUT
const { GatewayIntentBits, Partials, Collection, AuditLogEvent, AuditLogOptionsType, EmbedBuilder } = require("discord.js");const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "guildMemberUpdate",
    /**
     * @param {GuildMember} interaction
     */
  async execute(oldMember, newMember, interaction, client) {
    const { guild } = interaction;
    if(oldMember.permissions.has("SendMessages") == false) {
      if(newMember.permissions.has("SendMessages") == true) {
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberUpdate,
        });
        const timeoutLog = fetchedLogs.entries.first();
        if (!timeoutLog) return "Invalid";
        const { executor, target } = timeoutLog;
        if (target.id == newMember.user.id) {
          let logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Timedout User`)
            .setFooter({
              text: newMember.guild.name,
              iconURL: newMember.guild.iconURL(),
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
                name: "**[**`*️⃣`**] Timeout Reason**",
                value: `**(** ` + "`" + timeoutLog.reason + "` **)**",
                inline: false,
              },
              {
                name: "**[**`*️⃣`**] Timeout Duration**",
                value:
                  "**(** `" +
                  `${moment(
                    await newMember.communicationDisabledUntilTimestamp
                  ).format("lll")}` +
                  "` **)**",
                inline: false,
                //value: `**(** ` + `<t:${Math.round(await newMember.communicationDisabledUntilTimestamp / 1000)}:R>` + ' **)**',
              },
              {
                name: "**[**`*️⃣`**] Expiry Date**",
                value:
                  `**(** ` +
                  `<t:${Math.round(
                    (await newMember.communicationDisabledUntilTimestamp) / 1000
                  )}:R>` +
                  " **)**",
                inline: false,
              },
              {
                name: "**[**`📅`**] Timeout Date**",
                value:
                  `**(** ` +
                  "`" +
                  moment(timeoutLog.createdAt).format("LLLL") +
                  "` **)**",
                inline: false,
              }
            );
          try {
            await newMember.guild.channels.cache
              .get(`${config.logChannels.userTimedout}`)
              .send({ embeds: [logEmbed] });
          } catch (error) {
            console.log(error);
          }
        } else {
          let logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Timedout User`)
            .setFooter({
              text: newMember.guild.name,
              iconURL: newMember.guild.iconURL(),
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
                name: "**[**`*️⃣`**] Timeout Reason**",
                value: `**(** ` + "`" + timeoutLog.reason + "` **)**",
                inline: false,
              },
              {
                name: "**[**`*️⃣`**] Timeout Duration**",
                value:
                  `**(** ` +
                  `<t:${Math.round(
                    (await newMember.communicationDisabledUntilTimestamp) / 1000
                  )}:R>` +
                  " **)**",
                inline: false,
              },
              {
                name: "**[**`📅`**] Timeout Date**",
                value:
                  `**(** ` +
                  "`" +
                  moment(timeoutLog.createdAt).format("LLLL") +
                  "` **)**",
                inline: false,
              }
            );
          try {
            await newMember.guild.channels.cache
              .get(`${config.logChannels.userTimedout}`)
              .send({ embeds: [logEmbed] });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
};
