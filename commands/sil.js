const Discord = require('discord.js');
const database = require('quick.db');

exports.run = async (client, message, args) => {// can#0002

  function error() {
    return message.reply('Bir şeyler ters gitti.')
  } 

  if(!message.member.hasPermission('MANAGE_MESSAGES')) return error();
  
  if(!args[0]) return message.reply('Bir sayı gir.');
  if(args[0] > 1000) return error();
  if(args[0] <= 0) return error();
  if(message.mentions.channels.first()) message.channel = message.mentions.channels.first();

  if(args[0] > 100) {
    for(var i = 0; i < args[0].split('')[0]; i++) {
      message.channel.bulkDelete(100);
    }
  } else {
    message.channel.bulkDelete(args[0]);
  }

}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'sil'
};