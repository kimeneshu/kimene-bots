const Discord = require("discord.js")
const { Database, Logger } = require("../helpers/functions");
const ayar = require('../settings.js')
module.exports.run = async(client, message, args, embed) => {
    if (ayar.roles.muteStaff.some(s => !message.member.roles.cache.has(s)) && !message.member.hasPermission(128)) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)).sil(7);
    let top = message.guild.memberCount;
    let tagges = message.guild.members.cache.filter(s => ayar.guild.tagges.some(a => s.user.tag.toLowerCase().includes(a))).size
 let taglı= message.guild.members.cache.filter(s => ayar.guild.tagges.some(a => s.user.username.toLowerCase().includes(a))).size
 let etiketli = message.guild.members.cache.filter(s => ayar.guild.tagges.some(a => s.user.discriminator.includes(a.replace("#","")))).size
    let ses = message.guild.members.cache.filter(s => s.voice.channel).size
    let boost = message.guild.premiumSubscriptionCount;
    let boostlevel = message.guild.premiumTier;
    let online = message.guild.members.cache.filter(s => s.presence.status != "offline").size

    message.channel.send(embed.setDescription(`
• Şu anda toplam **${ses}** kişi seslide.
• Sunucuda **${top}** adet üye var. ( **${online}** Aktif )
• Toplam **${tagges}** adet üye tagımızı alarak bizi desteklemiş.
• Sunucuda **${boost}** takviye bulunmakta. Sunucu şuanda **${boostlevel}.** seviyede
`)).sil(15)
    message.react(ayar.emojis.yes).catch(e => {})
};
exports.config = {
    name: "say",
    usage: `${ayar.bot.botPrefix}say`,
    guildOnly: true,
    aliases: [],
    cooldown: 3000
};
