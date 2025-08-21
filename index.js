const TelegramBot = require("node-telegram-bot-api");

// Bot token
const token = "8177710298:AAHwisP3-LCQ94eehYYsOGFLX1i9hsmPl_s";
const bot = new TelegramBot(token, { polling: true });

// Admin ID
const ADMIN_ID = 7057837673;

// Foydalanuvchilarni saqlash
let users = {};

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!users[userId]) {
    users[userId] = {
      lastClick: null,
      totalClicks: 0,
      name: msg.from.first_name || "NoName",
    };
  }

  bot.sendMessage(chatId, "👋 Xush kelibsiz!\nQuyidagi tugma orqali WebApp oching:", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "🚀 WebApp ni ochish",
            web_app: { url: "https://278uzz.github.io/clickearn/" },
          },
        ],
      ],
      resize_keyboard: true,
    },
  });
});

// Tugma bosilganda kunlik limit
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (msg.text === "🚀 WebApp ni ochish") {
    const now = new Date();
    const lastClick = users[userId]?.lastClick;

    if (lastClick && now.toDateString() === lastClick.toDateString()) {
      bot.sendMessage(chatId, "❌ Siz bugun allaqachon kirgansiz! Ertaga qayta urinib ko‘ring.");
    } else {
      users[userId].lastClick = now;
      users[userId].totalClicks += 1;
      bot.sendMessage(chatId, "✅ Muvaffaqiyatli! Bugun sizga ruxsat berildi.");
    }
  }

  // Admin komandalar
  if (userId === ADMIN_ID) {
    if (msg.text === "/users") {
      let text = "👥 Bot foydalanuvchilari:\n\n";
      for (let id in users) {
        text += `🆔 ${id} | 👤 ${users[id].name} | 🔢 Clicks: ${users[id].totalClicks}\n`;
      }
      bot.sendMessage(chatId, text || "Hali foydalanuvchi yo‘q.");
    }

    if (msg.text.startsWith("/reset")) {
      const parts = msg.text.split(" ");
      if (parts[1]) {
        const targetId = parts[1];
        if (users[targetId]) {
          users[targetId].totalClicks = 0;
          users[targetId].lastClick = null;
          bot.sendMessage(chatId, `♻️ ${targetId} foydalanuvchining clicklari tozalandi.`);
        } else {
          bot.sendMessage(chatId, "❌ Bunday foydalanuvchi topilmadi.");
        }
      } else {
        bot.sendMessage(chatId, "❗ Foydalanuvchi ID yozing: `/reset 123456789`");
      }
    }
  }
});
