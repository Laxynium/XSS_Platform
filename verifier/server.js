//verifies reflected XSS
var express = require("express");
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
var app = express();
const port = 3000;

app.use(
  asyncHandler(async (req, res, next) => {
    if (
      req.headers["skip-validation"] ||
      req.url.endsWith(".js") ||
      req.url.endsWith(".css")
    ) {
      next();
      return;
    } else {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setExtraHTTPHeaders({
          "skip-validation": "true",
        });
        page.on("dialog", async (dialog) => {
          res.setHeader("X-Validation-Result", "12345");

          await dialog.accept();
        });
        const url = req.url;
        await page.goto(`http://localhost:${port}${url}`);
        // TODO use it for another level
        // await page.focus("input.input-field");
        // await page.keyboard.type('<img src="" onerror="alert(1)"></img>');
        // await page.click("button.verify-button");
        page.waitForTimeout(2000);
        await browser.close();
      } catch (error) {
        console.log(error);
      }

      next();
    }
  })
);

app.use(express.static("public", []));

app.use(function (req, res, next) {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
