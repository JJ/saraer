import PPTX from "nodejs-pptx";

let pptx = new PPTX.Composer();

await pptx.load(`assets/plantilla.pptx`);
await pptx.compose(async (pres) => {
  await pres.getSlide("slide2").addImage((image) => {
    image.file(`/tmp/session-0-talk-1.png`).x(500).y(100).cx(166).cy(100);
  });
});
await pptx.save(`/tmp/prueba.pptx`);
