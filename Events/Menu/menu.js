const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const fs = require("fs");
const { loadFiles } = require('../../Functions/fileLoader.js');


module.exports = {
    name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if(interaction.customId == 'helpMenu') {
      const selection = interaction.values[0];

      const Files = await loadFiles(`Commands/${selection}`);
      let commandList = [] 
      Files.forEach((file) => {
        const command = require(file);
        
       commandList.push(`/${command.data.name.charAt(0).toUpperCase() + command.data.name.slice(1)} - ${command.data.description}\n`)

      })

      function capitalizeFL(str) {
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
        return capitalized 
      }


      const embed = new EmbedBuilder()
        .setTitle(`Command list for ${selection}`)
        .setDescription(`\`\`\`${commandList.toString().replaceAll(',', '')}\`\`\``)
        .setColor("0x2F3136")
        .addFields(
          {
            name: ":open_file_folder:  Command Count",
            value: `<:reply:1002181954864681030> ${commandList.length} command(s)`
          }
        )
  
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
}