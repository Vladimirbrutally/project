import { chromium } from "@playwright/test";

const stl = `solid tetra
facet normal 0 0 1
outer loop
vertex 0 0 0
vertex 40 0 0
vertex 0 40 0
endloop
endfacet
facet normal 0 -1 0
outer loop
vertex 0 0 0
vertex 0 0 40
vertex 40 0 0
endloop
endfacet
facet normal -1 0 0
outer loop
vertex 0 0 0
vertex 0 40 0
vertex 0 0 40
endloop
endfacet
facet normal 1 1 1
outer loop
vertex 40 0 0
vertex 0 0 40
vertex 0 40 0
endloop
endfacet
endsolid tetra`;

const viewports = [
  { name: "desktop", width: 1440, height: 980 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
    await page.setInputFiles('input[type="file"]', {
      name: "tetra.stl",
      mimeType: "model/stl",
      buffer: Buffer.from(stl),
    });
    await page.getByText("STL loaded successfully").waitFor({ timeout: 10000 });
    await page.locator("canvas").waitFor({ timeout: 10000 });
    await page.waitForTimeout(1000);

    const canvasStats = await page.locator("canvas").evaluate((source) => {
      const sample = document.createElement("canvas");
      sample.width = Math.min(120, source.width);
      sample.height = Math.min(120, source.height);
      const context = sample.getContext("2d");

      if (!context) {
        return { width: source.width, height: source.height, nonBlank: 0 };
      }

      context.drawImage(source, 0, 0, sample.width, sample.height);
      const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
      let nonBlank = 0;

      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] !== 0 || pixels[index + 1] !== 0 || pixels[index + 2] !== 0) {
          nonBlank += 1;
        }
      }

      return { width: source.width, height: source.height, nonBlank };
    });

    if (canvasStats.width <= 0 || canvasStats.height <= 0 || canvasStats.nonBlank <= 100) {
      throw new Error(`${viewport.name} canvas did not render enough pixels`);
    }

    await page.screenshot({ path: `dist/${viewport.name}-visual-check.png`, fullPage: true });
    await page.close();
  }

  console.log("Visual checks passed");
} finally {
  await browser.close();
}
