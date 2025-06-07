// commands/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('퐁! 봇이 반응하는지 확인합니다.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 측정 중...', fetchReply: true });

    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    await interaction.editReply(`퐁! 🏓\n• 메시지 반응 속도: ${ping}ms\n• API Ping: ${apiPing}ms`);
  },
};
