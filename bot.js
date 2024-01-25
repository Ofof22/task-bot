const { Client, Intents } = require('discord.js');

const config = require("./config.js");
const prefix = "!s*"; // Komut öneki
const sunucular = ["SUNUCU_ID_1"]; // Sunucu ID'lerini içeren dizi

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ban') {
    // Kullanıcı yetkisi kontrolü
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('Bu komutu kullanmaya yetkiniz yok.');

    // Etiketlenen kullanıcıyı al
    const user = message.mentions.users.first();
    if (!user) return message.reply('Banlanacak kullanıcıyı etiketleyin.');

    // Belirtilen sunuculardaki kullanıcıları kontrol etme ve ban işlemi
    sunucular.forEach(async guildID => {
      const guild = client.guilds.cache.get(guildID);
      if (!guild) return;

      const inGuild = guild.members.cache.has(user.id);
      if (inGuild) {
        try {
          const bannedUser = await guild.members.ban(user);
          const logChannel = guild.channels.cache.find(channel => channel.name === 'log-kanalı'); // Log kanalının adı
          if (logChannel) {
            logChannel.send(`${user.tag} (${user.id}) sunucudan banlandı.`);
          }
          message.reply(`${bannedUser.user.tag} başarıyla ${guild.name} sunucusundan banlandı.`);
        } catch (error) {
          console.error('Banlama hatası:', error);
          message.reply('Kullanıcıyı banlarken bir hata oluştu.');
        }
      } else {
        message.reply(`Belirtilen sunucuda (${guild.name}) kullanıcı bulunamadı.`);
      }
    });
  }
});

client.login("MTE4MDE4NTA1OTM3MDczNzcwNg.Gpeopk.Ea0tvJ6OJ5pzxVttLtVVkMQYXL0-Ws428Bqq54"); // Botunuzun token'ı
