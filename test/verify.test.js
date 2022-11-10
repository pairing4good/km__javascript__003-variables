const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should define a variable named courseLength', async () => {
    const courseLength = await page.evaluate(() => courseLength);
    expect(courseLength).toBeDefined();
  });
  
  it('should assign courseLength to the number 20', async () => {
    const courseLength = await page.evaluate(() => courseLength);
    expect(courseLength).toBe(20);
  });
  
  it('should assign the innerHTML of the HTML element with the id result to the courseLength', async () => {
    const innerHtml = await page.$eval('#result', (result) => {
      return result.innerHTML;
    });
    
    expect(innerHtml).toBe('20')
  });
});

