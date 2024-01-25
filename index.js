const { Client, GatewayIntentBits, Events, Collection, EmbedBuilder } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const INTENTS = Object.values(GatewayIntentBits);
const client = new Client({ intents: INTENTS });
const config = require("./config.js");
const chalk = require('chalk');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require("fs");
const moment = require("moment");
const { DisTube } = require("distube")
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require("@distube/spotify")
const { DeezerPlugin } = require("@distube/deezer")

client.DisTube = new DisTube(client, {
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    searchSongs: 5,
    searchCooldown: 30,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new DeezerPlugin()]
})
const express = require('express');
const app = express();
const port = 3000;

// Ana sayfa isteğine yanıt verme
app.get('/', (req, res) => {
  res.send('Merhaba, Express ile dünyaya hoş geldiniz!');
});

// Özel bir yol için yanıt verme

// Belirtilen bir port üzerinden sunucuyu başlatma
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});

let token = config.bot.token;

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: "10" }).setToken(token);

const log = (x) => {
    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);
};

const commands = [];
readdirSync("./commands").forEach(async (file) => {
    const command = await require(`./commands/${file}`);
    if (command) {
        client.commands.set(command.name, command);
        commands.push(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
                client.commandaliases.set(alias, command.name);
            });
        }
    }
});

const slashcommands = [];
readdirSync("./commands").forEach(async (file) => {
    const command = await require(`./commands/${file}`);
    slashcommands.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
    console.log(chalk.cyan("[+] " + command.data.name + " Yüklendi"));

});

client.on(Events.ClientReady, async () => {
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: slashcommands,
        });
    } catch (error) {
        console.error(error);
    }
    log(chalk.green(`${client.user.username} Aktif Edildi!`));
});


readdirSync("./events").forEach(async (file) => {
    const event = await require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

/*/
const kufurList = fs.readFileSync('./küfür.txt', 'utf-8').split('\n').filter(Boolean);

let alreadyReplied = false; // ADDED LINE

client.on('messageCreate', message => {
  if (message.author.bot) return; // Ignore messages from bots

  const content = message.content.toLowerCase();
  if (kufurList.some(k => content.includes(k))) {
    message.reply(`hey ${message.author.username} Küfürlü ve/veya Argolu cümle kullanmak yasak`).then(sentMessage => {
      setTimeout(() => {
        sentMessage.delete();
        message.delete();
        alreadyReplied = true; // ADDED LINE
      }, 2000);
    });
  }
});

const reklam = fs.readFileSync('./reklam.txt', 'utf-8').split('\n').filter(Boolean);

let c = false; // ADDED LINE

client.on('messageCreate', message => {
  if (message.author.bot) return; // Ignore messages from bots

  const content = message.content.toLowerCase();
  if (reklam.some(k => content.includes(k))) {
    message.reply(`hey ${message.author.username} Küfürlü ve/veya Argolu cümle kullanmak yasak`).then(sentMessage => {
      setTimeout(() => {
        sentMessage.delete();
        message.delete();
        c = true; // ADDED LINE
      }, 2000);
    });
  }
});
/*/


// Ban koruması
const banLimits = new Map();
const kickLimits = new Map();



client.on('guildMemberRemove', async member => {
  const logChannel = member.guild.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Üye Atıldı')
      .setDescription(`${member.user.tag} sunucudan atıldı.`)
    logChannel.send({ embeds: [embed] });
  }
});

client.on('guildMemberKick', async (guild, user) => {
  let kicks = 1;
  if (kickLimits.has(user.id)) {
    kicks = kickLimits.get(user.id);
    kicks++;
  }
  kickLimits.set(user.id, kicks);
  if (kicks >= 3) {
    guild.members.ban(user, { reason: 'Kick limiti aşıldı.' });
    kickLimits.delete(user.id);
    const logChannel = guild.channels.cache.get('1184561029850599526');
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Kick Limit Aşıldı')
        .setDescription(`${user.tag} kick limitini aştı ve sunucudan banlandı.`)
      logChannel.send({ embeds: [embed] });
    }
  }
});

// Log çeşitliliği
client.on('channelCreate', (channel) => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Kanal Oluşturuldu')
      .setDescription(`${channel.name} adlı kanal oluşturuldu.`)
    logChannel.send({ embeds: [embed] });
  }
});

client.on('channelDelete', (channel) => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Kanal Silindi')
      .setDescription(`${channel.name} adlı kanal silindi.`)
    logChannel.send({ embeds: [embed] });
  }
});

client.on('guildMemberRemove', member => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Üye ayrıldı')
      .setDescription(`${member.user.tag} sunucudan ayrıldı.`)
    logChannel.send({ embeds: [embed] });
  }
});

client.on('messageDelete', message => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Mesaj Silindi')
      .setDescription(`Mesaj: ${message.content} silindi. -- Mesaj sahibi: ${message.author.username}`)
    logChannel.send({ embeds: [embed] });
  }
});
client.on('messageCreate', async message => {
  if (message.content === 'tamam12') {
    const fetched = await message.channel.messages.fetch({ limit: 100 });
    message.channel.bulkDelete(fetched)
      .then(messages => console.log(`Successfully deleted ${messages.size} messages`))
      .catch(console.error);
    message.channel.send('Tüm mesajlar silindi.');
  }
});
client.on('messageCreate', async message => {
  if (message.content === 'bumm12') {
    const channel = await message.guild.channels.create(message.channel.name, { type: 'text' });
    await channel.setPosition(message.channel.position);

    const newChannel = await message.channel.clone({ name: message.channel.name });
    await message.channel.send('Kendim tarafından silindi, iyi günler dilerim :)');
  }
});

client.on('roleCreate', role => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Rol Oluşturuldu')
      .setDescription(`${role.name} adlı rol oluşturuldu.`)
    logChannel.send({ embeds: [embed] });
  }
});

const channelCooldowns = new Set();

client.on('messageCreate', message => {
    if (channelCooldowns.has(message.channel.id)) {
        return;
    }
    channelCooldowns.add(message.channel.id);
    setTimeout(() => {
        channelCooldowns.delete(message.channel.id);
    }, 5000);
});
client.on('roleDelete', role => {
  const logChannel = client.channels.cache.get('1184561029850599526');
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Rol Silindi')
      .setDescription(`${role.name} adlı rol silindi.`)
    logChannel.send({ embeds: [embed] });
  }
});
client.login(config.bot.token); // Botunuzun token'ı

