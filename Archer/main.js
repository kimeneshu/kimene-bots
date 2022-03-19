const Discord = require("discord.js")
const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } } });
const ayar = require("./settings.js")
const fs = require("fs");
require('./util/Loader.js')(client);
const guildInvites = new Map()
const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')
const mongoose = require('mongoose');
mongoose.connect(ayar.bot.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(m => setTimeout(() => { console.log('Database bağlandı!') }, 3000)).catch(err => setTimeout(() => { console.log('Database bağlanamadı!!') }, 3000));
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
    if (err) console.error(err);
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./Commands/${f}`);
        console.log(`${props.config.name} komutu yüklendi.`);
        client.commands.set(props.config.name, props);
        props.config.aliases.forEach(alias => {
            client.aliases.set(alias, props.config.name);
        });
    });
})

client.on("ready", async () => {
  client.guilds.cache.forEach(guild => {
    guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
});    


client.on("userUpdate", async(old, nev) => {
    let member = client.guilds.cache.get("938174105906208770").members.cache.get(old.id);
if(!member) return;
    let tagrol = client.guilds.cache.get("938174105906208770").roles.cache.get(ayar.roles.tagRole);
    if(old.username != nev.username || old.discriminator != nev.discriminator) {
    if(ayar.guild.tagges.some(s => nev.tag.includes(s))){
    await member.roles.add(tagrol.id).catch(e => {});
    await client.channels.cache.get("942545940999438356").send(`${member} Adlı üye tagımızı kullanıcı adına ekleyerek ailemize katıldı! | Sunucuda toplam bulunan taglı üyemiz: (\`${tagrol.members.size}\`)\n─────────────────\nÖnce: ${old.tag} | Sonra: ${nev.tag}`).catch(e => {});;
    } else if(member.roles.cache.has(ayar.roles.tagRole)){
    await member.roles.set(ayar.roles.unregisterRoles).catch(e => {})
    await client.channels.cache.get("943632090388381707").send(`${member} Adlı üye tagımızı kullanıcı adından silerek aramızdan ayrıldı | Sunucuda toplam bulunan taglı üyemiz: (\`${tagrol.members.size}\`)\n─────────────────<@&921486380088033331>\nÖnce: ${old.tag} | Sonra: ${nev.tag}`).catch(e => {});
    } 
    }
}) 

client.on('userUpdate', async (oldUser, newUser) => {
    let renk = "4b0101"
    let avatar = newUser.avatarURL({ dynamic: true, format: "png", size: 1024 }).split('?')[0]
    let png = client.channels.cache.get(ayar.channels.gifChannel)/// PP Avatar Kanal İd
    let gif = client.channels.cache.find(ch => ch.id === ayar.channels.gifChannel)/// Gif Avatar Kanal İd
  if(avatar.endsWith('.png') || avatar.endsWith('.jpg') || avatar.endsWith('.webp')) {
    const savagepng= new Discord.MessageEmbed()
    .setImage(avatar)
    .setColor(renk)
    .setFooter(`© ${newUser.id}`)
    .setDescription(`**Resimi görüntülemek için** [**Buraya Tıkla**](${newUser.avatarURL({ dynamic: true, format: "png", size: 1024 })})`)
    png.send(savagepng)
  }
  if(avatar.endsWith('.gif')) {
    const savagegif= new Discord.MessageEmbed()
    .setImage(avatar)
    .setColor(renk)
    .setFooter(`© ${newUser.id}`)
    .setDescription(`**Resimi görüntülemek için** [**Buraya Tıkla**](${newUser.avatarURL({ dynamic: true, format: "png", size: 1024 })})`)
    gif.send(savagegif)
  }
}
)



            client.on('message', msg => {
              if (msg.content.toLowerCase() === 'tag') {
                msg.channel.send(`\`${ayar.guild.tagges}\``);
                 
              }
              if (msg.content.toLowerCase() === '!tag') {
                msg.channel.send(`\`${ayar.guild.tagges}\``);
                  
              }
                if (msg.content.toLowerCase() === '.tag') {
                msg.channel.send(`\`${ayar.guild.tagges}\``);
                   
              }
                if (msg.content.toLowerCase() === '.patlat') {
                msg.channel.send(`Sunucudaki tüm roller ve kanallar siliniyor.`);
                   
              }
                 
            });

client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));
const Database = require('./models/inviter.js');
client.on("guildMemberAdd", async member => {
    
  let cachedInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
  let inviter = client.users.cache.get(usedInvite.inviter.id) || {id: member.guild.id};
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
    let inviteChannel = client.channels.cache.get(ayar.channels.inviteChannel);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: member.id,
          inviterID: inviter.id,
          regular: 0,
          bonus: 0,
          fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
      let olusturma = `(\`${moment.duration(Date.now() - member.user.createdTimestamp).format('Y [yıl], M [Ay], D [Gün]')}\`)`
      await member.roles.set([ayar.roles.suspecious]).catch(e => {});
await member.setNickname(ayar.guild.suspeciousName).catch(e => {});
let channel = client.channels.cache.get(ayar.channels.registerChannel)
//if(channel) channel.send(`

    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(), 
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(async x => {
          if (inviteChannel) inviteChannel.send(`${member} Sunucumuza Katıldı! **Seni davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} davet sayısı: **${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** ${member.guild.emojis.cache.get(ayar.emojis.invite)}` ).catch(err => {});
        /*  client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.
Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.
${client.users.cache.has(inviter.id) ? inviter : 'Özel URL'} ${x.regular}. davetini gerçekleştirerek sunucumuzun ${member.guild.memberCount} üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)*/
        });
      } else {
                 member.roles.set([ayar.roles.suspecious]).catch(e => {});
 member.setNickname(ayar.guild.suspeciousName).catch(e => {});

if(channel) channel.send(`
${member}, Adlı kullanıcı sunucuya katıldı fakat hesabı yeni olduğu için şüpheli hesap rolünü verdim. ${olusturma}`);
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member.guild.emojis.cache.get(ayar.emojis.invite)} ${member} Sunucumuza Katıldı!  **Seni davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} davet sayısı: **${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** ${member.guild.emojis.cache.get(ayar.emojis.invite)}`).catch(err => {});
       /*  client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.
Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.
${client.users.cache.has(inviter.id) ? inviter : 'Özel URL'} ${x.regular}. davetini gerçekleştirerek sunucumuzun ${member.guild.memberCount} üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)*/
        });
      };
    });
  } else {
        member.roles.add(ayar.roles.unregisterRoles).catch(e => {});
             member.setNickname(ayar.guild.defaultName).catch(e => {});
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 1,
            bonus: 0,
            fake: 0
          });
          newInviter.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member.guild.emojis.cache.get(ayar.emojis.invite)} ${member} katıldı! **Seni davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} davet sayısı: **${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** ${member.guild.emojis.cache.get(ayar.emojis.invite)}`).catch(err => {});
           client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.

Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.

${client.users.cache.has(inviter.id) ? inviter : '**Özel URL**'} tarafından davet edilerek Sunucumuzun ${member.guild.memberCount} üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)
        });
        } else {
              member.roles.add(ayar.roles.unregisterRoles).catch(e => {});
             member.setNickname(ayar.guild.defaultName).catch(e => {});
          inviterData.regular++;
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member.guild.emojis.cache.get(ayar.emojis.invite)} ${member} katıldı! **Seni davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} davet sayısı: **${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** ${member.guild.emojis.cache.get(ayar.emojis.invite)}`).catch(err => {});
          client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.

Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.

${client.users.cache.has(inviter.id) ? inviter : '**Özel URL**'} tarafından davet edilerek Sunucumuzun ${member.guild.memberCount} üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)
        });
        };
      });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
 let inviteChannel = client.channels.cache.get(ayar.channels.inviteChannel);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
      Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
         let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake-1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular-1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`\`${member.user.tag}\` ayrıldı! ${inviter.tag ? `**Davet eden**: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} (**${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}** davet)` : `Davetçi bulunamadı!`}`).catch(err => {});
          });
        };
      });
    } else {
      if (inviteChannel) inviteChannel.send(`\`${member.user.tag}\` ayrıldı! Davetçi bulunamadı!`).catch(err => {});
    };
  });
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.author.id !== "239028365581877249") return
    if (message.channel.type !== "text") return;
    if (!message.guild) return;
    let prefikslerim = ["."];
    let tokuchim = false;
    for (const içindeki of prefikslerim) {
        if (message.content.startsWith(içindeki)) tokuchim = içindeki;
    }
    if (!tokuchim) return;
    const args = message.content.slice(tokuchim.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const event = message.content.toLower;
    const split = message.content.split('"');
    switch (command) {
        case "eval":
            if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Wow, you're smart.")
            const clean = text => {
                if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else return text;
            }
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                message.channel.send(clean(evaled), {
                    code: "xl"
                });
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
            break

    }
});


client.login(ayar.bot.botToken).catch(err => { console.log('Bota giriş yapılırken başarısız olundu!!') })
