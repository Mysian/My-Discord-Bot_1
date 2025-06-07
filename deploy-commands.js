require('dotenv').config();
// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

// 너의 디스코드 앱 ID (애플리케이션 ID)
const CLIENT_ID = '1380841362752274504';
// 적용할 서버 ID (너의 디스코드 서버 ID)
const GUILD_ID = '785841387396005948';

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 슬래시 명령어 등록 중...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ 슬래시 명령어 등록 완료!');
  } catch (error) {
    console.error(error);
  }
})();
