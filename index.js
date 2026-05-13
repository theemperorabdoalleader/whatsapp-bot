const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  // حفظ السيشن
  sock.ev.on("creds.update", saveCreds);

  // 🔥 كود الربط برقمك
  if (!sock.authState.creds.registered) {
    const phoneNumber = "201149182286"; // رقمك اتحط هنا

    const code = await sock.requestPairingCode(phoneNumber);
    console.log("📌 كود الربط:", code);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;

    if (connection === "open") {
      console.log("✅ البوت اشتغل واتصل بنجاح");
    }

    if (connection === "close") {
      console.log("❌ الاتصال اتقفل... بيحاول تاني");

      setTimeout(() => {
        startBot();
      }, 5000);
    }
  });
}

startBot();
