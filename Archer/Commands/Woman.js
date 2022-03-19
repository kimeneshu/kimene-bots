const Discord = require("discord.js");
const ayar = require('../settings.js');
const { Register } = require('../helpers/functions.js');
const registerData = require('../models/register.js');
module.exports.run = async(client, message, args, embed) => {
    if (!message.member.hasPermission("VIEW_AUDIT_LOG") && ayar.roles.registerStaff.some(s => !message.member.roles.cache.has(s))) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)).sil(7)
    let member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]))

    args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;


    if (!member || !isim) return message.channel.send(embed.setDescription(`${message.member}, Geçerli bir üye ve isim belirtmelisin.`)).sil(7)
    let fixTag = `${member.user.username.includes(ayar.guild.tag) ? ayar.guild.tag : ayar.guild.defaultTag}`
    var name = Register.fixname(member, isim, yaş);

    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda.`)).sil(7) && message.sil(7)
    if (member.user.bot) return message.channel.send(embed.setDescription(`${message.member}, Kayıt ettiğin kullanıcı bir bot olamaz.`)).sil(7)
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${member}, Kendini kayıt edemezsin.`)).sil(7)
  let data = await registerData.findOne({ guildID: message.guild.id })
    if (data && data.tagMode === true) 
   if(!member.user.username.includes("Zyrox") && !member.user.username.includes("zyrox")&& !member.user.username.includes("ZYROX")   && !member.user.discriminator.includes("1944")&& !member.roles.cache.has("913849757305307227")) return message.channel.send(`Kayıt etmeye çalıştıgınız kişi taglı veya Booster degil`).sil(30);

    await Register.woman(member, message.member, name, message.channel)
    message.react(ayar.emojis.yes).catch(e => {})
};
exports.config = {
    name: "kız",
    guildOnly: true,
    aliases: ["k", "kadın"],
    cooldown: 3000
};
