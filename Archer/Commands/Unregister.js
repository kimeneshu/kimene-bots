const Discord = require("discord.js");
const ayar = require('../settings.js');
const { Register } = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
    if (!message.member.hasPermission("VIEW_AUDIT_LOG") && ayar.roles.registerStaff.some(s => !message.member.roles.cache.has(s))) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)).sil(7)
    let member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]))

    if (!member) return message.channel.send(embed.setDescription(`${message.member}, Geçerli bir üye ve isim belirtmelisin.`)).sil(7)
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.member}, Kendini kayıtsıza atamazsın!`)).sil(7)
    if (member.user.bot) return message.channel.send(embed.setDescription(`${message.member}, Kayıtsıza attığın üye bir bot olamaz!`)).sil(7)
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription(`${message.member}, Belirttiğin üye senden üst/aynı pozisyonda!`)).sil(7)
    if (member.roles.cache.has(ayar.roles.boosterRole)) return message.channel.send(embed.setDescription(`${message.member}, Kayıtsıza atmaya çalıştığın üye bir booster olamaz!`)).sil(7)
    await member.roles.set(ayar.roles.unregisterRoles).catch(err => {});
    await member.setNickname(ayar.guild.defaultName).catch(err => {});
    message.channel.send(embed.setDescription(`${member}, Adlı üye kayıtsıza atıldı!`)).sil(7)
    message.react(ayar.emojis.yes).catch(e => {})
};
exports.config = {
    name: "kayıtsız",
    guildOnly: true,
    aliases: ["unregister"],
    cooldown: 3000
};
