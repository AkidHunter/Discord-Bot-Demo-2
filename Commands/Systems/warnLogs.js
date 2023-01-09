const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const warnSchema = require("../../Schemas/warnSchema"); // change this to your path if needed.

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn-logs")
    .setDescription("Get the logs of a user")
    .addSubcommand((subCmd) =>
      subCmd
        .setName("warns")
        .setDescription("Get the warns of a user")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("User to get the warn logs for")
            .setRequired(true);
        })
        .addIntegerOption((option) => {
          return option
            .setName("page")
            .setDescription("The page to display if there are more than 1")
            .setMinValue(2)
            .setMaxValue(20);
        })
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    switch (interaction.options.getSubcommand()) {
      case "warns":
        {
          const user = interaction.options.getUser("user");
          const page = interaction.options.getInteger("page");

          const userWarnings = await warnSchema.find({
            userId: user.id,
            guildId: interaction.guild.id,
          });

          if (!userWarnings?.length)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("User Warn Logs")
                  .setDescription(`${user} has no warn logs`)
                  .setColor("Red"),
              ],
            });

          const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s warn logs`)
            .setColor("#2f3136");

          if (page) {
            const pageNum = 5 * page - 5;

            if (userWarnings.length >= 6) {
              embed.setFooter({
                text: `page ${page} of ${Math.ceil(userWarnings.length / 5)}`,
              });
            }

            for (const warnings of userWarnings.splice(pageNum, 5)) {
              const moderator = interaction.guild.members.cache.get(
                warnings.moderator
              );

              embed.addFields({
                name: `id: ${warnings._id}`,
                value: `
                  <:reply:1002181954864681030> Moderator: ${
                    moderator || "Moderator left"
                  }
                  <:reply:1002181954864681030> User: ${warnings.userId}
                  <:reply:1002181954864681030> Reason: \`${
                    warnings.warnReason
                  }\`
                  <:reply:1002181954864681030> Date: ${warnings.warnDate}
                  `,
              });
            }

            return await interaction.reply({ embeds: [embed] });
          }

          if (userWarnings.length >= 6) {
            embed.setFooter({
              text: `page 1 of ${Math.ceil(userWarnings.length / 5)}`,
            });
          }

          for (const warns of userWarnings.slice(0, 5)) {
            const moderator = interaction.guild.members.cache.get(
              warns.moderator
            );

            embed.addFields({
              name: `id: ${warns._id}`,
              value: `
              <:reply:1002181954864681030> Moderator: ${
                  moderator || "Moderator left"
                }
                <:reply:1002181954864681030> User: ${warns.userId}
                <:reply:1002181954864681030> Reason: \`${
                  warns.warnReason
                }\`
                <:reply:1002181954864681030> Date: ${warns.warnDate}
                `,
            });
          }

          return await interaction.reply({ embeds: [embed] }).then(() => {
            setTimeout(async() => {
              await interaction.deleteReply();
            }, 20000);
          });
        }
        break;

      default:
        break;
    }
  },
};
