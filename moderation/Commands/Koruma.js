const Discord = require("discord.js")
const { Database, Logger } = require("../helpers/functions");
const ayar = require('../settings.js')
module.exports.run = async(client, message, args, embed) => {
    let offyalaaskim = ["324130263036723200","851540270947631124","825380031244009472","616220178115461125","814121975471407104"]
  if (!offyalaaskim.includes(message.author.id)) return message.channel.send("Sadece bot sahipleri kurucular kullanabilir!").then(message.react('881157147755442217')).then(taka => taka.delete({timeout: 5000}))
  if(args[0] == "kapat") {
      let nisan = message.guild.roles.cache.get("894302164468514866")
      let ocak = message.guild.roles.cache.get("894302165236068422")
      let subat = message.guild.roles.cache.get("894302175101067265")
      let mart = message.guild.roles.cache.get("894302173918277663")
      let mayıs = message.guild.roles.cache.get("894302180692066315")
      
      nisan.setPermissions(1572711105)
      ocak.setPermissions(1304275649)
      subat.setPermissions(230533825)
      mart.setPermissions(3517121)
      mayıs.setPermissions(1048704)
    

      message.channel.send(`${ayar.emojis.yes} Sunucumuzun yönetici rolleri güvenli moddan çıkıp tekrardan aktif hale getirilmiştir.`)
  } else if(args[0] == "aç") {
      let sunucu = client.guilds.cache.get("872792888721940531");
      if (!sunucu) return;
      sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
        await r.setPermissions(0);
      })
      message.channel.send(`${ayar.emojis.red} Sunucumuzun yönetici rolleri güvenli moda alınıp rollerdeki izinler kapatılmıştır.`)
  }
  message.react(ayar.emojis.yes).catch(e => {})
    },

exports.config = {
    name: "koruma",
    usage: `${ayar.bot.botPrefix}koruma`,
    guildOnly: true,
    aliases: ["koruma"],
    cooldown: 3000
};