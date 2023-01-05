// ROLE CREATE
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");

module.exports = {
  name: "roleCreate",
  /**
   * @param {Role} interaction
   */ 
  async execute(role, interaction, client) {
    const { guild } = interaction;
    const fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleCreate,
    });
    const roleLog = fetchedLogs.entries.first();
    if (!roleLog) return "Invalid";
    const { executor, target } = roleLog;
    let logEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Role Created`)
      .setFooter({
        text: role.guild.name,
        iconURL: role.guild.iconURL(),
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
          name: "**[**`*️⃣`**] Role Name**",
          value: `**(** ` + "`" + role.name + "` **)**",
          inline: false,
        },
        {
          name: "**[**`📅`**] Creation Date**",
          value:
            `**(** ` +
            "`" +
            moment(roleLog.createdAt).format("LLLL") +
            "` **)**",
          inline: false,
        }
      );
    try {
      await role.guild.channels.cache
        .get(`${config.logChannels.roleCreate}`)
        .send({ embeds: [logEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
