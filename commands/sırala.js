const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("messagelist")
        .setDescription("Top 10 mesaj puanlaması"),

    async execute(interaction) {
        // Sunucudaki tüm üyeleri çek
        const guildMembers = await interaction.guild.members.fetch();

        // Üyeleri mesaj sayılarına göre sırala
        const sortedMembers = guildMembers.sort((a, b) => b[1].messages.cache.size - a[1].messages.cache.size).array();

        // Top 10 üyeyi al
        const topMembers = sortedMembers.slice(0, 10);

        // Embed oluştur
        const embed = {
            title: "Top 10 Mesaj Puanlaması",
            description: topMembers.map((member, index) => `**${index + 1}.** ${member[1].user.tag} - ${member[1].messages.cache.size} mesaj`).join("\n")
        };

        // Sonucu gönder
        interaction.reply({ embed: embed });
    },
};
