// index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

// 명령어 모음 저장할 공간
client.commands = new Collection();

// commands 폴더에서 명령어 파일 불러오기
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// 봇이 준비됐을 때 로그 찍기
client.once('ready', () => {
  console.log(`✅ 봇 로그인 완료: ${client.user.tag}`);
});

// 슬래시 명령어 실행 핸들링
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ 명령어 실행 중 오류가 발생했어요.', ephemeral: true });
  }
});
console.log("✅ [디버그] Railway TOKEN:", process.env.TOKEN);
console.log("✅ 디버그: 토큰 존재 여부 =", !!process.env.TOKEN);
console.log("📦 디버그: 토큰 내용 =", process.env.TOKEN?.slice(0, 10) + '...');

client.login(process.env.TOKEN);

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const now = new Date().toISOString();

  const activityPath = path.join(__dirname, 'activity.json');
  let activity = {};

  if (fs.existsSync(activityPath)) {
    activity = JSON.parse(fs.readFileSync(activityPath));
  }

  activity[userId] = now;

  fs.writeFileSync(activityPath, JSON.stringify(activity, null, 2));
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const userId = newState.id;
  const now = new Date().toISOString();

  if (!oldState.channel && newState.channel) {
    const activityPath = path.join(__dirname, 'activity.json');
    let activity = {};

    if (fs.existsSync(activityPath)) {
      activity = JSON.parse(fs.readFileSync(activityPath));
    }

    activity[userId] = now;

    fs.writeFileSync(activityPath, JSON.stringify(activity, null, 2));
  }
});
