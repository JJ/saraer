import PPTX from "nodejs-pptx";

let pptx = new PPTX.Composer();

await pptx.load(`assets/plantilla.pptx`);
await pptx.compose(async (pres) => {
  await pres.getSlide("slide1").addText((text) => {
    text
      .value("Título")
      .x(50)
      .y(10)
      .cx(400)
      .cy(400)
      .fontSize(40)
      .textColor("FF0000");
  });
  await pres.getSlide("slide1").addText((text) => {
    text
      .value("Nombre Persona")
      .x(50)
      .y(50)
      .cx(400)
      .cy(400)
      .fontSize(30)
      .textColor("FFFF00");
  });
  await pres.getSlide("slide2").addImage((image) => {
    image.file(`/tmp/session-0-talk-1.png`).x(300).y(100).cx(400).cy(400);
  });
});
await pptx.save(`/tmp/prueba.pptx`);
