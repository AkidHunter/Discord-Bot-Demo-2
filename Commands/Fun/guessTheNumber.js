const {
  MessageEmbed,
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guessthenumber")
    .setDescription("Guess the number game")
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("The channel were the game should happen.")
        .setRequired(true)
    )
    .addNumberOption((options) =>
      options
        .setName("range")
        .setDescription(
          "The range of the random number. Eg: 100 (it means 0-100)"
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const channel = options.getChannel("channel");
    const range = options.getNumber("range");

    await interaction.reply({
      ephemeral: true,
      content: "Starting the game...",
    });

    await channel.send({
      embeds: [
        {
          title: "Guess the number!",
          description:
            "Guess the number in this chat, and try to get it right!",
        },
      ],
    });

    const collector = await channel.createMessageCollector({
      time: 60000,
      filter: (m) => !m.author.bot,
    });

    let min = 1;
    const randomInt = min + Math.floor(Math.random() * (range - min + 1));

    collector.on("collect", async (msg) => {
      if (msg.content === randomInt) {
        collector.stop();
        await channel.send(
          `${msg.author} has guessed the number correctly!! The number was: \`${randomInt}\``
        );
      }
    });

    collector.on("end", async (m, r) => {
      if (r === "time") {
        await channel.send(
          `No one guessed the number correctly! The number was: \`${randomInt}\``
        );
      }
    });
  },
};
