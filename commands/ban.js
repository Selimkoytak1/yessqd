const Discord = require('discord.js');
const database = require('quick.db');

exports.run = async (client, message, args) => {// can#0002

  function error() {
    return message.reply('Bir şeyler ters gitti.')
  } 

  if(!message.member.hasPermission('BAN_MEMBERS')) return error();
  
  if(!args[0]) return message.reply('Birini etiketle.');
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!member) return error();

  if(member.roles.highest.position >= message.member.roles.highest.position) return error();
  if(member.roles.highest.position >= message.guild.members.cache.get(client.user.id).roles.highest.position) return error();

  member.user.send('Yasaklandın.');
  return message.guild.members.ban(member.user.id, { reason: 'Banned by '+message.author.tag });

}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ban'
};