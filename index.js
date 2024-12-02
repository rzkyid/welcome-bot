require('dotenv').config(); // Memuat konfigurasi dari .env
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = express();
const port = process.env.PORT || 3000; // Menggunakan PORT dari .env atau 3000 sebagai default

const WELCOME_IMAGE_URL = 'https://i.imgur.com/13IvTa6.png'; // Gambar latar belakang baru
const WELCOME_CHANNEL_ID = '1313095157477802034';
const GOODBYE_CHANNEL_ID = '1313095157477802034';

// Bot login
client.once('ready', () => {
  console.log('Bot is online!');
});

// Function to add text with shadow
function addTextWithShadow(ctx, text, font, color, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Set shadow properties
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 6;

  // Draw the text with shadow
  ctx.fillText(text, x, y);
}

// Welcome image when a new member joins
client.on('guildMemberAdd', async (member) => {
  const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!welcomeChannel) return;

  // Create welcome image with 16:9 aspect ratio (700x393)
  const canvas = createCanvas(700, 393);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Set text style (bold and centered)
  const fontMain = '70px "Impact"'; // Bold and thick font
  const fontSecondary = '60px "Impact"'; // Slightly smaller bold font
  const fontTertiary = '50px "Impact"'; // Same size for tertiary text

  // Add text to canvas with shadow
  addTextWithShadow(ctx, 'Welcome!', fontMain, 'white', canvas.width / 2, 80);
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 150);
  addTextWithShadow(ctx, 'Semoga betah disini!', fontTertiary, 'white', canvas.width / 2, 220);

  // Send the image to the welcome channel
  welcomeChannel.send({
    content: `<@${member.id}>`,
    files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
  });
});

// Goodbye image when a member leaves
client.on('guildMemberRemove', async (member) => {
  const goodbyeChannel = member.guild.channels.cache.get(GOODBYE_CHANNEL_ID);
  if (!goodbyeChannel) return;

  // Create goodbye image with 16:9 aspect ratio (700x393)
  const canvas = createCanvas(700, 393);
  const ctx = canvas.getContext('2d');

  // Load background image
  const background = await loadImage(WELCOME_IMAGE_URL);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Set text style (bold and centered)
  const fontMain = '70px "Impact"'; // Bold and thick font
  const fontSecondary = '60px "Impact"'; // Slightly smaller bold font
  const fontTertiary = '50px "Impact"'; // Same size for tertiary text

  // Add text to canvas with shadow
  addTextWithShadow(ctx, 'Goodbye!', fontMain, 'white', canvas.width / 2, 80);
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 150);
  addTextWithShadow(ctx, 'Semoga sukses!', fontTertiary, 'white', canvas.width / 2, 220);

  // Send the image to the goodbye channel
  goodbyeChannel.send({
    content: `<@${member.id}>`,
    files: [{ attachment: canvas.toBuffer(), name: 'goodbye-image.png' }],
  });
});

// Command to trigger welcome image manually
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!slwelcome') {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const member = message.member;

    // Create welcome image with 16:9 aspect ratio (700x393)
    const canvas = createCanvas(700, 393);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text style (bold and centered)
    const fontMain = '70px "Impact"'; // Bold and thick font
    const fontSecondary = '60px "Impact"'; // Slightly smaller bold font
    const fontTertiary = '50px "Impact"'; // Same size for tertiary text

    // Add text to canvas with shadow
    addTextWithShadow(ctx, 'Welcome!', fontMain, 'white', canvas.width / 2, 80);
    addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 150);
    addTextWithShadow(ctx, 'Semoga betah disini!', fontTertiary, 'white', canvas.width / 2, 220);

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
    });
  }

  if (message.content.toLowerCase() === '!slgoodbye') {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const member = message.member;

    // Create goodbye image with 16:9 aspect ratio (700x393)
    const canvas = createCanvas(700, 393);
    const ctx = canvas.getContext('2d');

    // Load background image
    const background = await loadImage(WELCOME_IMAGE_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text style (bold and centered)
    const fontMain = '70px "Impact"'; // Bold and thick font
    const fontSecondary = '60px "Impact"'; // Slightly smaller bold font
    const fontTertiary = '50px "Impact"'; // Same size for tertiary text

    // Add text to canvas with shadow
    addTextWithShadow(ctx, 'Goodbye!', fontMain, 'white', canvas.width / 2, 80);
    addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, 150);
    addTextWithShadow(ctx, 'Semoga sukses!', fontTertiary, 'white', canvas.width / 2, 220);

    // Send the image to the channel
    message.channel.send({
      content: `<@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'goodbye-image.png' }],
    });
  }
});

// Login ke Discord menggunakan token dari .env
client.login(process.env.DISCORD_TOKEN);

// Setup Express server (Optional, untuk menjalankan server Express)
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
