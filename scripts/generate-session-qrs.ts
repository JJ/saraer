import QRCode from "https://deno.land/x/qrust_bridge@v1.0/mod.ts";

const prefix = Deno.args[0] || "http://localhost:8000";
const number_of_sessions = Number(Deno.args[1]) || 1;
const talks_per_session = Number(Deno.args[2]) || 8;

for (let i = 0; i < number_of_sessions; i++) {
  for (let j = 0; j < talks_per_session; j++) {
    const qrcode = new QRCode(`${prefix}/${i}/${j}`);
    qrcode.save(`qrcode/${i}-${j}.png`);
  }
}
