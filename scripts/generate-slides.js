import PPTX from "nodejs-pptx";
import { readFileSync } from "fs";

const pptx = new PPTX.Composer();

const text = readFileSync("talks.txt");
const talks = text.toString().split("\n");

let titleAndAuthors = Array.from(
  talks.map((talk) => {
    const [title, authors] = talk.split(".");
    return { title, authors };
  })
);

console.log(titleAndAuthors);
titleAndAuthors.pop();

for (let i = 4; i >= 1; i--) {
  for (let j = 4; j >= 1; j--) {
    const talk = titleAndAuthors.pop();
    const { title, authors } = talk;
    console.log(talk, title, authors);
    await pptx.load(`assets/plantilla.pptx`);
    await pptx.compose(async (pres) => {
      await pres.getSlide("slide1").addText((text) => {
        text
          .value(title)
          .x(50)
          .y(2)
          .cx(400)
          .cy(200)
          .fontSize(40)
          .textColor("FF0000");
      });
      await pres.getSlide("slide1").addText((text) => {
        text
          .value(authors)
          .x(200)
          .y(100)
          .cx(400)
          .cy(300)
          .fontSize(30)
          .textColor("FFFF00");
      });
      await pres.getSlide("slide2").addImage((image) => {
        image.file(`/tmp/session-0-talk-1.png`).x(300).y(100).cx(400).cy(400);
      });
    });
    await pptx.save(`assets/plantilla-sesion-${j}-charla-${i}.pptx`);
  }
}
