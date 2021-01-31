const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const fs = require("fs");
const database = require('quick.db');
const moment = require('moment');
moment.locale('tr');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
if(err) console.error(err);
console.log(`${files.filter(a => a.endsWith('.js')).length} komut yüklenecek.`);
database.set('moment', Date.now());
files.filter(a => a.endsWith('.js')).forEach(async f => {

let command = require(`./commands/${f}`);
if(!command) return;

client.commands.set(command.help.name, command);
command.conf.aliases.forEach(alias => client.aliases.set(alias, command.help.name));
console.log(`${command.help.name} yüklendi.`)
});
});

client.elevation = message => {
if(!message.guild) return;
var permlvl = 0;
if(message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
if(message.member.permissions.has("BAN_MEMBERS")) permlvl = 2;
if(message.member.permissions.has("ADMINISTRATOR")) permlvl = 3;
return permlvl;
};

client.config = require('./structures/config.js');
client.login(client.config.token);

client.on('ready', async () => {
require("./util/eventLoader")(client);
client.user.setStatus('online');
console.log(`${client.user.tag} ismi ile giriş yaptım.`);
console.log(`${moment(Date.now()-database.fetch('moment')).format('ss.SS')} içinde başlatıldı.`);
});

client.on('ready', () => {
client.guilds.cache.forEach(guild => {
guild.members.cache.forEach(async member => {
const database = require('quick.db');
if(!database.fetch(`mute.${member.user.id}`)) return;
const data = await database.fetch(`mute.${member.user.id}`);
if(Date.now() <= data.bitiş) {
setTimeout(() => {
member.roles.remove(member.roles.cache.find(x => x.name === 'Muted').id).catch(console.error);
database.delete(`mute.${member.user.id}`);
return member.user.send('Susturulman açıldı.');
}, data.bitiş-Date.now());
};
});
});
});