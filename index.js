const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    // 🔥 أول ما الاتصال يبدأ
    if (connection === "connecting") {
      console.log("⏳ جاري الاتصال...");

      if (!sock.authState.creds.registered) {
        const phoneNumber = "201149182286"; // رقمك

        try {
          const code = await sock.requestPairingCode(phoneNumber);
          console.log("📌 كود الربط:", code);
        } catch (err) {
          console.log("❌ حصل خطأ في الكود:", err.message);
        }
      }
    }

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
