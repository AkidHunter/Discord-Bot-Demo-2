// const { ButtonInteraction, EmbedBuilder } = require("discord.js");
// const wait = require('node:timers/promises').setTimeout;

// module.exports = {
//     name: "interactionCreate",
//     /**
//      * 
//      * @param {ButtonInteraction} interaction 
//      */
//     async execute(interaction) {
//         if(!interaction.isButton()) return;

//         const splitArray = interaction.customId.split("-");
//         if(!splitArray[0] === "MemberLogging") return;

//         const member = (await interaction.guild.members.fetch()).get(splitArray[2]);
//         const Embed = new EmbedBuilder();
//         const errorArray = [];

//         if(!interaction.member.permissions.has("KickMembers"))
//         errorArray.push("You do not have the required permissions for this action.");
//         await wait(1000);
//         if(!member)
//         return interaction.reply({embeds: [Embed.setDescription("This user is no longer a member of this guild.")]})
//         await wait(1000);
//         if(!member.moderatable)
//         errorArray.push(`${member} is not moderatable by this bot.`);

//         if(errorArray.length) return interaction.reply({
//             embeds: [Embed.setDescription(errorArray.join("\n"))],
//             ephemeral: true
//         });
        
//         switch(splitArray[1]) {
//             case "Kick" : {
//                 member.kick(`Kicked by: ${interaction.user.tag} | Member Logging System`).then(() => {
//                     interaction.reply({embeds: [Embed.setDescription(`${member} has been kicked.`)]})
//                 }).catch(() => {
//                     interaction.reply({embeds: [Embed.setDescription(`${member} could not be kicked.`)]})
//                 })
//             }
//             break;
//             case "Ban" : {
//                 member.ban(`Banned by: ${interaction.user.tag} | Member Logging System`).then(() => {
//                     interaction.reply({embeds: [Embed.setDescription(`${member} has been banned.`)]})
//                 }).catch(() => {
//                     interaction.reply({embeds: [Embed.setDescription(`${member} could not be banned.`)]})
//                 })
//             }
//             break;
//         }
//     }
// }