const Discord = require("discord.js");
const { EmbedBuilder, SlashCommandBuilder, color } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("general")
    .setDescription("Send a premade general chat embed"),

  async execute(interaction) {
    const Embed = new EmbedBuilder()
      .setTitle(
        "<:officialzybre:1023673792410693765> Zybre Client | Language Information"
      )
      .setColor("Color,AQUA")
      .setDescription(
        ":flag_gb: If you are not an English speaker, make sure you check <#970029131825832048> to get yourself your personal language role! \n\n :flag_pt: Se tu não és um falante de inglês, certifica-te de verificar <#970029131825832048> para obteres o teu cargo de idioma pessoal! \n\n :flag_nl: Als je geen Engels spreekt, kijk dan even naar <#970029131825832048> om taal rollen te krijgen \n\n :flag_fr: Si vous n'êtes pas anglophone, assurez-vous de vérifier <#970029131825832048> votre rôle linguistique personnel! \n\n :flag_es: Si tu no eres un hablante de inglés, ¡Asegúrate de consultar <#970029131825832048> para tu función lingüística personal!"
      );

    interaction.channel.send({ embeds: [Embed] });
    interaction.reply({ content: "Message sent!", ephemeral: true });
  },
};
