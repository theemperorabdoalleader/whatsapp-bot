const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const P = require("pino");
const qrcode = require("qrcode-terminal");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  // حفظ السيشن
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // عرض QR كصورة في اللوج
    if (qr) {
      console.log("📌 امسح الكود ده:");
      qrcode.generate(qr, { small: true });
    }

    // تم الاتصال
    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح");
    }

    // لو الاتصال اتقفل
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔄 حصل قطع... سيب Railway يعيد التشغيل");
      } else {
        console.log("❌ تم تسجيل الخروج");
      }
    }
  });
}

// تشغيل البوت
startBot();
