const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu, EmbedBuilder } = require("discord.js");
const guildIDs = ['1183331768699453440', '1183331912413089822', '1183332519895121930', '1183336742976229397', '1183336861696016404', '1183336984018702416']; // Sunucu ID'lerinizi buraya ekleyin
const permittedRoleID = '1180136603453235322'; // İzin verilen rol ID'sini buraya ekleyin

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banla')
        .setDescription('Belirli sunuculardan kullanıcıyı yasaklar')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Yasaklanacak kullanıcı')
                .setRequired(true)),
    run: async (client, interaction) => {
        if (interaction.member.roles.cache.has(permittedRoleID)) {
            const bannedUser = interaction.options.getUser('kullanici');
            if (!bannedUser) {
                return interaction.reply('Belirtilen kullanıcı bulunamadı.');
            }
            const promises = guildIDs.map(async guildID => {
                const guild = client.guilds.cache.get(guildID);
                if (!guild) return;
                try {
                    await guild.members.ban(bannedUser, { reason: 'Multiple Guild Ban' });
                } catch (error) {
                    // Hataları gerekirse işleyin
                    console.error(error);
                }
            });

            // Tüm yasaklamalar tamamlanana kadar bekleyin
            await Promise.all(promises);

            // Tüm yasaklamalar bittikten sonra tek bir yanıt gönderin
            return interaction.reply('Belirtilen kullanıcı başarıyla yasaklandı.');
        } else {
            return interaction.reply('Bu komutu kullanma izniniz yok.');
        }
    },
};
