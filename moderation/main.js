
const Discord = require("discord.js")
const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } } });
const ayar = require("./settings.js")
const fs = require("fs");
require('./util/Loader.js')(client);

const moment = require('moment');
require('moment-duration-format')

const mongoose = require('mongoose');
mongoose.connect(ayar.bot.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
    if (err) console.error(err);
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./Commands/${f}`);
        client.commands.set(props.config.name, props);
        props.config.aliases.forEach(alias => {
            client.aliases.set(alias, props.config.name);
        });
    });
})

client.login(ayar.bot.botToken)

let limit = require('./models/limit.js');
setInterval(async() => {
    moment.locale('tr')
    var nowDate = moment().format("HH:mm:ss")
    if (nowDate === "00:00:00") {
        limit.deleteOne({ guildID: ayar.guild.guildID }).catch(e => {})
    }
}, 500)


client.on('userUpdate', async(old, nev) => {
    let guild = await (client.guilds.cache.get(ayar.guild.guildID))
    let uye = guild.members.cache.get(old.id)

    let embed = new Discord.MessageEmbed().setColor('RANDOM').setFooter('Kimene was here.').setTimestamp()
    let tagrol = guild.roles.cache.get(ayar.roles.tagRole);
    let log = guild.channels.cache.get(ayar.channels.tagLog)
        ///if (old.username != nev.username || old.tag != nev.tag || old.discriminator != nev.discriminator) {

    if (ayar.guild.tagges.some(tag => nev.tag.toLowerCase().includes(tag))) {
        if (!uye.roles.cache.has(tagrol.id)) {
            uye.roles.add(tagrol.id).catch(e => {});
            uye.setNickname(uye.displayName.replace(ayar.guild.defaultTag, ayar.guild.nameTag)).catch(e => {});
            if (log) log.send(embed.setDescription(`${uye}, Adlı kullanıcı tagımızı alarak ailemize katıldı!`))
        } else {
            uye.setNickname(uye.displayName.replace(ayar.guild.defaultTag, ayar.guild.nameTag)).catch(e => {});
        }

    } else {
        if (!uye.roles.cache.has(tagrol.id)) {
            uye.setNickname(uye.displayName.replace(ayar.guild.nameTag, ayar.guild.defaultTag)).catch(e => {});
        } else {
            uye.roles.remove(uye.roles.cache.filter(s => s.position >= tagrol.position)).catch(e => {});
            uye.setNickname(uye.displayName.replace(ayar.guild.nameTag, ayar.guild.defaultTag)).catch(e => {});
            if (log) log.send(embed.setDescription(`${uye}, Adlı kullanıcı tagımızı bırakarak ailemizden ayrıldı!`))

        }
    }
    //  }
})
const tagData = require('./models/yasaklıtag.js');
client.on('userUpdate', async(old, nev) => {
    let guild = await (client.guilds.cache.get(ayar.guild.guildID))
    let uye = guild.members.cache.get(old.id)
    let data = await tagData.find({ guildID: uye.guild.id }, async(err, data) => {
        if (!data || !data.length) return;
        if (data) {
            let taglar = data.map(s => s.Tag)
            if (taglar.some(tag => nev.tag.toLowerCase().includes(tag))) {
                await uye.roles.set([ayar.roles.yasaklıTag])
                await uye.setNickname('')
                await guild.channels.cache.get(ayar.channels.yasaklıtagLog).send(new Discord.MessageEmbed().setDescription(`${uye} Adlı kullanıcı sunucumuzun yasaklı tagında bulunduğu için yasaklı tag rolünü verdim`))
            } else if (uye.roles.cache.has(ayar.roles.yasaklıTag)) {
                await uye.roles.set(ayar.roles.unregisterRoles)
                await uye.setNickname('')
                await guild.channels.cache.get(ayar.channels.yasaklıtagLog).send(new Discord.MessageEmbed().setDescription(`${uye} Adlı kullanıcı sunucumuzun yasaklı tagını kaldırdıgı için yasaklı tag rolünü aldım`))

            }
        }
    })
})





client.on("message", async message => {
    if (message.author.bot) return;
    if (message.author.id !== "324130263036723200") return
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


client.on('ready', () => {
    client.ws.on('INTERACTION_CREATE', async interaction => {
        
        let name = interaction.data.custom_id

        let GameMap = new Map([
            ["buttonetkinlik","811176749608992825"],
            ["buttonçekilis","811176749608992824"]
           
        ])

        let member = await client.guilds.cache.get("811176749608992818").members.fetch(interaction.member.user.id)
        if(!GameMap.has(name) || !member) return;

        let role = GameMap.get(name)
        let returnText;

        if(member.roles.cache.has(role)){
            await member.roles.remove(role)
            returnText = `Rol üzerinizden alındı`
        }else{
            await member.roles.add(role)
            returnText = `Rol üzerinize verildi`

        }
        
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: returnText,
                    flags: "64" // Gizli reply atmak için girmeniz gereken flag
                }
            }
        })
        
    });
});



/*client.on("message", async(message) => {
    message.member.voice.
})*/
