require('dotenv').config(); // Memuat konfigurasi dari .env
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');
const express = require('express');

// Daftarkan font Bebas Neue
registerFont('./fonts/BebasNeue-Regular.ttf', { family: 'Bebas Neue' });

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
const WELCOME_CHANNEL_ID = '1313109618037231668';
const GOODBYE_CHANNEL_ID = '1313109618037231668';

// Heartbeat untuk memeriksa aktivitas bot
function heartbeat() {
    setInterval(() => {
        console.log('\x1b[35m[ HEARTBEAT ]\x1b[0m', `Bot is alive at ${new Date().toLocaleTimeString()}`);
    }, 30000);
}

// Bot Ready
client.once('ready', () => {
    console.log('\x1b[36m[ INFO ]\x1b[0m', `Ping: ${client.ws.ping} ms`);
    heartbeat();
});

// Menambahkan endpoint agar bot bisa di-ping dari Uptime Robot
app.get('/', (req, res) => {
  res.send('Bot is running!');
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

// Function to draw profile picture with white outline
async function drawProfilePicture(ctx, user, x, y, size) {
  try {
    // Get avatar URL and ensure it's in PNG format
    let avatarURL = user.displayAvatarURL({ size: 128, extension: 'png' });

    // Debugging log: Show the final avatar URL
    console.log(`Attempting to load avatar from URL: ${avatarURL}`);

    // Load the avatar image
    const avatar = await loadImage(avatarURL);
    console.log('Avatar loaded successfully');

    // Create a circular clipping path for the profile picture
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2); // Draw circle at (x, y) with radius size/2
    ctx.closePath();
    ctx.clip();  // Clip the context to the circle

    // Draw a white outline around the profile picture
    ctx.lineWidth = 10; // Make the outline thicker
    ctx.strokeStyle = 'white'; // Set outline color to white
    ctx.beginPath();
    ctx.arc(x, y, size / 2 + 6, 0, Math.PI * 2); // Draw a slightly larger circle for the outline
    ctx.stroke(); // Apply the outline

    // Draw the profile picture inside the circle
    ctx.drawImage(avatar, x - size / 2, y - size / 2, size, size); // Draw image at the center of the circle
  } catch (error) {
    console.error('Error loading or drawing avatar:', error);
  }
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
  const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
  const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
  const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

  // Add text to canvas first (so it doesn't overlap with the profile picture)
  const textYPosition = 0;  // Starting Y position for text
  addTextWithShadow(ctx, 'Welcome', fontMain, 'white', canvas.width / 2, textYPosition + 263); // Teks pertama (ubah posisi ke 263)
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, textYPosition + 303); // Teks kedua
  addTextWithShadow(ctx, 'I Hope You Enjoy!', fontTertiary, 'white', canvas.width / 2, textYPosition + 333); // Teks ketiga

  // Position for profile picture (centered below the text)
  const profilePicX = canvas.width / 2;
  const profilePicY = textYPosition + 120;  // Position profile picture 120px below the text
  const profilePicSize = 180;

  // Draw profile picture with white outline after the text
  await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

  // Send the image to the welcome channel
  welcomeChannel.send({
    content: `Welcome to 18 StReet Losvagos <@${member.id}>`,
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
  const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
  const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
  const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

  // Add text to canvas first (so it doesn't overlap with the profile picture)
  const textYPosition = 0;  // Starting Y position for text
  addTextWithShadow(ctx, 'Goodbye', fontMain, 'white', canvas.width / 2, textYPosition + 263); // Teks pertama (ubah posisi ke 263)
  addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, textYPosition + 303); // Teks kedua
  addTextWithShadow(ctx, 'See You Again!', fontTertiary, 'white', canvas.width / 2, textYPosition + 333); // Teks ketiga

  // Position for profile picture (centered below the text)
  const profilePicX = canvas.width / 2;
  const profilePicY = textYPosition + 120;  // Position profile picture 120px below the text
  const profilePicSize = 180;

  // Draw profile picture with white outline after the text
  await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

  // Send the image to the goodbye channel
  goodbyeChannel.send({
    content: `Goodbye <@${member.id}>`,
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
    const fontMain = '50px "Bebas Neue"'; // Font Bebas Neue, ukuran 50px
    const fontSecondary = '30px "Bebas Neue"'; // Font Bebas Neue, ukuran 30px
    const fontTertiary = '25px "Bebas Neue"'; // Font Bebas Neue, ukuran 25px

    // Add text to canvas first (so it doesn't overlap with the profile picture)
    const textYPosition = 0;  // Starting Y position for text
    addTextWithShadow(ctx, 'Welcome', fontMain, 'white', canvas.width / 2, textYPosition + 263); // Teks pertama (ubah posisi ke 263)
    addTextWithShadow(ctx, member.user.username, fontSecondary, 'yellow', canvas.width / 2, textYPosition + 303); // Teks kedua
    addTextWithShadow(ctx, 'I Hope You Enjoy!', fontTertiary, 'white', canvas.width / 2, textYPosition + 333); // Teks ketiga

    // Position for profile picture (centered below the text)
    const profilePicX = canvas.width / 2;
    const profilePicY = textYPosition + 120;  // Position profile picture 120px below the text
    const profilePicSize = 180;

    // Draw profile picture with white outline after the text
    await drawProfilePicture(ctx, member.user, profilePicX, profilePicY, profilePicSize); // 100px size for profile picture

    // Send the image to the channel
    message.channel.send({
      content: `Welcome to 18 StReet Losvagos <@${member.id}>`,
      files: [{ attachment: canvas.toBuffer(), name: 'welcome-image.png' }],
    });
  }
});

// Login ke Discord menggunakan token dari .env
client.login(process.env.DISCORD_TOKEN);

// Setup Express server (Optional, untuk menjalankan server Express)
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
