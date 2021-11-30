//verifies reflected XSS
const express = require("express");
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const axios = require("axios").default;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
const port = 3000;
const mainBackendUrl = "http://host.docker.internal:5000/";

const jsonParser = bodyParser.json();

const skipValidationToken = crypto.randomBytes(64).toString("base64");

app.use(cookieParser());

app.post(
  "/verify",
  jsonParser,
  asyncHandler(async (req, res) => {
    const { payload, levelToken } = req.body;
    const cookies = Object.entries(req.cookies).map(
      ([key, value]) => `${key}=${value}`
    );

    //skip-validation is used in order to avoid infinite loop
    if (req.headers["skip-validation"] === skipValidationToken) {
      res.json({ validationResult: "not_empty" }); //has to be not empty so alert could be called
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
          "skip-validation": skipValidationToken,
        });

        const dialogPromise = getDialogResult();
        const payloadPromise = executePayload();
        await payloadPromise;
        const dialogResult = await dialogPromise;

        await browser.close();
         
        if (!dialogResult.isValid) {
          res.json({ validationResult: null });
          return;
        }

        var result = await completeLevel(levelToken, cookies);
        if (!result.isValid) {
          res.json({ validationResult: null });
          return;
        }
        const level = result.user.levels.find((x) => x.number === 2);
        if (!level) {
          res.json({ validationResult: null });
          return;
        }

        res.json({ validationResult: level.token });

        function getDialogResult() {
          const dialogPromise = new Promise((resolve) => {
            page.on("dialog", (dialog) => {
              console.log("dialog opened");
              dialog.accept().then((_) => {
                resolve({ isValid: true });
              });
            });
          });
          const timer = new Promise((resolve) => {
            setTimeout(() => {
              resolve({ isValid: false });
            }, 2000);
          });
          return Promise.race([dialogPromise, timer]);
        }

        function executePayload() {
          return new Promise(async (resolve) => {
            await page.goto(`http://localhost:${port}`);
            await page.waitForSelector("input.input-field");
            await page.focus("input.input-field");
            await page.keyboard.type(payload);
            await page.click("button.verify-button");
            resolve();
          });
        }
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

function completeLevel(levelToken, cookies) {
  return new Promise(async (resolve) => {
    try {
      console.log("Request data: ", levelToken, cookies);
      const result = await axios.post(
        new URL("users/me/levels/complete", mainBackendUrl).href,
        { level: 1, levelToken: levelToken },
        {
          headers: {
            Cookie: cookies.join("; "),
          },
        }
      );
      console.log(
        "Response data: ",
        result.status,
        result.headers,
        result.data
      );
      resolve({ isValid: true, user: result.data });
    } catch (error) {
      console.log(error);
      resolve({ isValid: false });
    }
  });
}
