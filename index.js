sock.ev.on("connection.update", async ({ connection, qr }) => {

  if (qr) {
    console.log("📌 امسح الكود بسرعة:");
    const qrcode = require("qrcode-terminal");
    qrcode.generate(qr, { small: true });
  }

  if (connection === "open") {
    console.log("✅ اتصل خلاص وثبت");
  }

  if (connection === "close") {
    console.log("❌ الاتصال اتقفل بس مش هنعيد تشغيل");
    // ❌ مهم: مفيش restart هنا
  }
});
