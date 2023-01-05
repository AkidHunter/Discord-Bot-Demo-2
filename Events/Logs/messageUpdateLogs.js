// MESSAGE UPDATE
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const moment = require('moment');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
  if(newMessage.member.bot) return;
  let logEmbed = new EmbedBuilder()
  .setColor('Orange')
  .setTitle(`Message Updated`)
  .setFooter({
    text: newMessage.guild.name,
    iconURL: newMessage.guild.iconURL()
  })
  .setTimestamp()
  .setThumbnail(newMessage.member.displayAvatarURL({ dynamic: true }))
  .addFields(
    {
      name: '**[**`👤`**] User**',
      value: `**(** ` + '`' + newMessage.member.user.tag + '` **)**',
      inline: false
    },
    {
      name: '**[**`🆔`**] User ID**',
      value: `**(** ` + '`' + newMessage.member.id + '` **)**',
      inline: false
    },
    {
      name: '**[**`*️⃣`**] Message Before**',
      value: `**(** ` + '`' + oldMessage.content + '` **)**',
      inline: false
    },
    {
      name: '**[**`*️⃣`**] Message After**',
      value: `**(** ` + '`' + newMessage.content + '` **)**',
      inline: false
    },
    {
      name: '**[**`📅`**] Updation Date**',
      value: `**(** ` + '`' + moment(newMessage.createdAt).format('LLLL') + '` **)**',
      inline: false
    }, 
  )
 
  try {
    await newMessage.guild.channels.cache.get(`${config.logChannels.messageUpdate}`).send({ embeds: [logEmbed] })
  } catch (error) {
    console.log(error);
  } 
}
}
 