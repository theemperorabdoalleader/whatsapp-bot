sock.ev.on("connection.update", (update) => {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log("📌 امسح الـ QR باستخدام موبايلك التاني:");
    console.log(qr);
  }

  if (connection === "open") {
    console.log("✅ البوت اشتغل واتصل بنجاح");
  }
});
