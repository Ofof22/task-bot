const { MessageActionRow, MessageSelectMenu, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

// Assuming you have the role ID and channel ID available
const roleID = '1180136603453235322';
const channelID = '1180140103469899847';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aktiflik')
        .setDescription('Oyuna aktiflik çağrısı yapar'),
    run: async (client, interaction) => {
        if (interaction.member.roles.cache.has(roleID)) {
            const channel = client.channels.cache.get(channelID);
            if (channel) {
                channel.send('<@&1180138454936453150>');
              const exampleEmbed = new EmbedBuilder()
              .setColor(0x0099FF)
              .setTitle('Oyuna aktiflik çagrısı yapılıyor lütfen oyuna giriniz.')
              .setDescription('Deneme oyun linki')
              channel.send({ embeds: [exampleEmbed] });
            } else {e
                console.log('Kanal bulunamadı');
            }
        } else {
            interaction.reply('Bu komutu kullanmaya yetkiniz yok!');
        }
    },
};