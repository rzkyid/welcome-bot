require('dotenv').config(); // Memuat variabel dari file .env
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Mengakses variabel lingkungan dari .env
const token = process.env.DISCORD_BOT_TOKEN;
const welcomeImageUrl = process.env.WELCOME_IMAGE_URL;
const goodbyeImageUrl = process.env.GOODBYE_IMAGE_URL;

// Tentukan channel ID untuk welcome dan goodbye (gunakan ID channel sesuai yang Anda inginkan)
const welcomeChannelId = 'YOUR_CHANNEL_ID_FOR_WELCOME';  // Ganti dengan ID channel untuk welcome
const goodbyeChannelId = 'YOUR_CHANNEL_ID_FOR_GOODBYE';  // Ganti dengan ID channel untuk goodbye

// Ketika bot siap
client.once('ready', () => {
  console.log('Bot is online!');
});

// Fitur welcome ketika member bergabung
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.get(welcomeChannelId); // Saluran selamat datang berdasarkan ID

  if (!channel) return;

  // Membuat canvas untuk gambar dan teks
  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  // Muat gambar background
  const backgroundImage = await loadImage(welcomeImageUrl);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar background ke canvas

  // Menambahkan teks "Welcome"
  ctx.font = '40px Arial'; // Ukuran font untuk "Welcome"
  ctx.fillStyle = '#FF6347'; // Warna teks "Welcome"
  ctx.textAlign = 'center';
  ctx.fillText('Welcome', canvas.width / 2, 60);

  // Menambahkan teks username member
  ctx.font = '50px Arial'; // Ukuran font untuk username
  ctx.fillStyle = '#32CD32'; // Warna teks untuk username
  ctx.fillText(member.user.username, canvas.width / 2, 120);

  // Menambahkan teks "Semoga betah disini!"
  ctx.font = '30px Arial'; // Ukuran font untuk "Semoga betah disini!"
  ctx.fillStyle = '#FFD700'; // Warna teks "Semoga betah disini!"
  ctx.fillText('Semoga betah disini!', canvas.width / 2, 180);

  // Mengonversi canvas menjadi buffer gambar
  const buffer = canvas.toBuffer();

  // Kirim pesan ke channel dengan gambar dan teks
  const attachment = {
    files: [{
      attachment: buffer,
      name: 'welcome-image.png',
    }]
  };

  channel.send({
    content: `${member}`, // Mention member baru
    files: attachment.files,
  });
});

// Fitur goodbye ketika member keluar
client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.get(goodbyeChannelId); // Saluran goodbye berdasarkan ID

  if (!channel) return;

  const goodbyeEmbed = new EmbedBuilder()
    .setColor('#FF0000') // Warna embed
    .setTitle('Sampai Jumpa!')
    .setDescription(`${member} telah meninggalkan server.`)
    .setImage(goodbyeImageUrl) // Menggunakan URL dari .env
    .setFooter({ text: 'Kami akan merindukanmu!' });

  channel.send({
    content: `${member}`, // Mention member yang keluar
    embeds: [goodbyeEmbed],
  });
});

// Fitur slwelcome untuk melihat hasil welcome tanpa menunggu member masuk
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!slwelcome') {
    // Hanya admin yang bisa menggunakan perintah ini
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    // Tentukan member dummy (contoh: bot sendiri)
    const member = message.guild.members.cache.get(client.user.id); 

    // Membuat canvas untuk gambar dan teks
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Muat gambar background
    const backgroundImage = await loadImage(welcomeImageUrl);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar background ke canvas

    // Menambahkan teks "Welcome"
    ctx.font = '40px Arial'; // Ukuran font untuk "Welcome"
    ctx.fillStyle = '#FF6347'; // Warna teks "Welcome"
    ctx.textAlign = 'center';
    ctx.fillText('Welcome', canvas.width / 2, 60);

    // Menambahkan teks username bot
    ctx.font = '50px Arial'; // Ukuran font untuk username
    ctx.fillStyle = '#32CD32'; // Warna teks untuk username
    ctx.fillText(client.user.username, canvas.width / 2, 120);

    // Menambahkan teks "Semoga betah disini!"
    ctx.font = '30px Arial'; // Ukuran font untuk "Semoga betah disini!"
    ctx.fillStyle = '#FFD700'; // Warna teks "Semoga betah disini!"
    ctx.fillText('Semoga betah disini!', canvas.width / 2, 180);

    // Mengonversi canvas menjadi buffer gambar
    const buffer = canvas.toBuffer();

    // Kirim pesan ke channel dengan gambar dan teks
    const attachment = {
      files: [{
        attachment: buffer,
        name: 'welcome-image.png',
      }]
    };

    message.channel.send({
      content: `Selamat datang ${client.user.username}`, // Mention bot
      files: attachment.files,
    });
  }
});

// Fitur slgoodbye untuk melihat hasil goodbye tanpa menunggu member keluar
client.on('messageCreate', (message) => {
  if (message.content.toLowerCase() === '!slgoodbye') {
    // Hanya admin yang bisa menggunakan perintah ini
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const goodbyeEmbed = new EmbedBuilder()
      .setColor('#FF0000') // Warna embed
      .setTitle('Sampai Jumpa!')
      .setDescription(`Bot ini akan memberi salam selamat tinggal.`)
      .setImage(goodbyeImageUrl) // Menggunakan URL dari .env
      .setFooter({ text: 'Kami akan merindukanmu!' });

    message.channel.send({
      content: 'Sampai Jumpa!', // Pesan perpisahan
      embeds: [goodbyeEmbed],
    });
  }
});

// Login ke bot dengan token dari .env
client.login(token);