const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  // إنشاء أو استدعاء Session
  const { state, saveCreds } = await useMultiFileAuthState("session");

  // إنشاء اتصال البوت
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }) // مفيش printQRInTerminal
  });

  // حفظ بيانات الدخول
  sock.ev.on("creds.update", saveCreds);

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
