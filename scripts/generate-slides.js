import PPTX from "nodejs-pptx";
import { readFileSync } from "fs";

const pptx = new PPTX.Composer();

const text = readFileSync("talks.txt");
const talks = text.toString().split("\n");
const authorsAndTalks = talks.map((talk) => talk.split("."));

for (let i = 1; i <= 4; i++) {
  for (let j = 1; j <= 4; j++) {
    await pptx.load(`assets/plantilla.pptx`);
    const [author, talk] = authorsAndTalks.shift();
    console.log(author, talk);
    await pptx.compose(async (pres) => {
      await pres.getSlide("slide1").addText((text) => {
        text
          .value(author)
          .x(50)
          .y(10)
          .cx(400)
          .cy(200)
          .fontSize(40)
          .textColor("FF0000");
      });
      await pres.getSlide("slide1").addText((text) => {
        text
          .value(talk)
          .x(100)
          .y(100)
          .cx(400)
          .cy(300)
          .fontSize(30)
          .textColor("FFFF00");
      });
      await pres.getSlide("slide2").addImage((image) => {
        image
          .file(`assets/session-${i}-talk-${j}.png`)
          .x(300)
          .y(100)
          .cx(400)
          .cy(400);
      });
    });
    await pptx.save(`assets/plantilla-sesion-${i}-charla-${j}.pptx`);
  }
}
