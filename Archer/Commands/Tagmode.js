const Discord = require("discord.js");
const ayar = require('../settings.js');
const registerData = require('../models/register.js');
const { Register } = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)).sil(7)
    let data = await registerData.findOne({ guildID: message.guild.id })
    if(!data) new registerData({guildID: message.guild.id, tagMode: false}).save();
    switch (args[0]) {
        case "aç":
            if (data && data.tagMode === true) return message.channel.send(embed.setDescription(`${client.emojis.cache.get(ayar.emojis.no)} taglı alım modu zaten aktif!`))
            data.tagMode = true;
            data.save();
            message.channel.send(embed.setDescription(`${client.emojis.cache.get(ayar.emojis.yes)} taglı alım modu başarıyla aktif edildi!`))
            break;
        case "kapat":
            if (data && data.tagMode === false) return message.channel.send(embed.setDescription(`${client.emojis.cache.get(ayar.emojis.no)} taglı alım modu zaten kapalı!`))
            data.tagMode = false;
            data.save();
            message.channel.send(embed.setDescription(`${client.emojis.cache.get(ayar.emojis.yes)} taglı alım modu başarıyla deaktif edildi!`))
            break;
        default:
            message.channel.send(embed.setDescription(`${message.member} Hatalı kullanım! \`\`\`${ayar.bot.botPrefix}taglıalım aç/kapat\`\`\``));
            break;
    }
};
exports.config = {
    name: "taglıalım",
    guildOnly: true,
    aliases: [],
    cooldown: 3000
};
