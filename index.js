const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { state, saveState } = useSingleFileAuthState('./session.json');

const sock = makeWASocket({
    auth: state
});

sock.ev.on('creds.update', saveState);

console.log("Bot is running...");

  // مراقبة حالة الاتصال
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // لو ظهر QR
    if (qr) {
      console.log("📌 امسح الـ QR باستخدام موبايلك التاني:");
      console.log(qr);
    }

    // لو البوت اتصل بنجاح
    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح");
    }

    // لو البوت اتقطع الاتصال
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 إعادة تشغيل البوت...");
        startBot();
      }
    }
  });
}

// تشغيل البوت
startBot();
