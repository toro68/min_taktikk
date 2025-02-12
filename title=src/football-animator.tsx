// Oppdater canvas med nye frames med et fast intervall (ca. 30 fps)
const intervalId = setInterval(() => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   const inlinedSvg = inlineAllStyles(svg);
   const svgString = serializer.serializeToString(inlinedSvg);
   
   // Opprett en ny Canvg-instans for denne oppdateringen – unngå bruk av v.load, som ikke finnes
   Canvg.from(ctx, svgString, {
      ignoreDimensions: true,
      ignoreClear: true,
   }).then(instance => {
      instance.resize(canvas.width, canvas.height);
      instance.render();
   });

   console.log("UpdateCanvas: " + (performance.now() - startTime).toFixed(0) + " ms");

   if (performance.now() - startTime >= 5000) {
      clearInterval(intervalId);
   }
}, 33); 