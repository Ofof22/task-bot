const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const roleId = "1180136603453235322"; // Replace with the specific role ID
const channelId = "1180140466444980284"; // Replace with the specific channel ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duyuru")
    .setDescription("Belirli bir role sahip kullanıcılar için duyuru yapar")
    .addBooleanOption((option) =>
      option
        .setName("everyone")
        .setDescription("Herkesi etiketle")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("mesaj")
        .setDescription("Yayınlanacak mesaj")
        .setRequired(false),
    )
    .addAttachmentOption((option) =>
      option.setName("resim").setDescription("Resim yükle").setRequired(false),
    ),
  run: async (client, interaction) => {
    const everyone = interaction.options.getBoolean("everyone");
    const message = interaction.options.getString("mesaj");
    const file = interaction.options.getAttachment("resim");

    if (interaction.member.roles.cache.has(roleId)) {
      if (!everyone) {
        const merhaba = new EmbedBuilder()
          .setTitle("Task | Duyuru")
          .setDescription(message);

        if (file) {
          merhaba.setImage(file.url);
        }

        const channel = client.channels.cache.get(channelId);
        channel.send({ embeds: [merhaba] });
      } else {
        // @everyone etiketi
        const embed = new EmbedBuilder()
          .setTitle("Duyuru")
          .setDescription(message);

        if (file) {
          embed.setImage(file.url);
        }

        interaction.channel.send({ content: "@everyone", embeds: [embed] });
      }
    } else {
      interaction.reply(
        "Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz",
      );
    }
  },
};
