//verifies reflected XSS
var express = require("express");
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
var bodyParser = require("body-parser");

var app = express();
const port = 3000;

const jsonParser = bodyParser.json();

app.post(
  "/verify",
  jsonParser,
  asyncHandler(async (req, res) => {
    const { payload } = req.body;
    //skip-validation is used in order to avoid infinite loop
    if (req.headers["skip-validation"]) {
      res.json({ validationResult: null });
      return;
    } else {
      try {
        const browser = await puppeteer.launch({
          args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
          ],
        });
        const page = await browser.newPage();
        page.setExtraHTTPHeaders({
          "skip-validation": "true",
        });
        let nextLevelToken = "null"; //TODO this token should be fetch from main server
        page.on("dialog", async (dialog) => {
          console.log("Dialog opened!")
          nextLevelToken = "1234abcd";
          res.setHeader("X-Validation-Result", nextLevelToken);
          await dialog.accept();
        });
        await page.goto(`http://localhost:${port}`);
        await page.waitForSelector("input.input-field");
        await page.focus("input.input-field");
        await page.keyboard.type(payload);
        await page.click("button.verify-button");
        res.json({ validationResult: nextLevelToken });
      } catch (error) {
        console.log(error);
      }
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
