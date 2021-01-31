const Discord = require('discord.js');
const database = require('quick.db');

exports.run = async (client, message, args) => {// can#0002

  function error() {
    return message.reply('Bir şeyler ters gitti.')
  } 

  if(!message.member.hasPermission('KICK_MEMBERS')) return error();
  
  if(!args[0]) return message.reply('Birini etiketle.');
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!member) return error();

  if(member.roles.highest.position >= message.member.roles.highest.position) return error();
  if(member.roles.highest.position >= message.guild.members.cache.get(client.user.id).roles.highest.position) return error();

  if(!args[1]) return message.reply('Bir zaman belirtmelisin.\n!mute <@!'+member.user.id+'> 1 gün');
  if(!args[2]) return message.reply('Bir zaman belirtmelisin.\n!mute <@!'+member.user.id+'> 1 gün');

  let zaman = args[1]+''+args[2].replace('gün', 'd').replace('saat', 'h').replace('dakika', 'm').replace('hafta', 'w').replace('saniye', 's');
  if(require('ms')(zaman) >= 1209600033.12) return error();
  
  const muteRole = await message.guild.roles.cache.find(x => x.name === 'Muted');
  if(!muteRole) {
  muteRole = message.guild.roles.create({
      data: {
        name: 'Muted',
        color: 'BLUE',
      }
    }).then(console.log).catch(console.error);
  }

  member.roles.add(muteRole.id);
  member.user.send('Susturuldun.');
  database.set(`mute.${member.user.id}`, {
   bitiş: Date.now()+require('ms')(zaman)
  });
  
  setTimeout(() => {
  member.roles.remove(muteRole.id);
  database.delete(`mute.${member.user.id}`);
  return member.user.send('Susturulman açıldı.');
  }, require('ms')(zaman));


}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mute'
};