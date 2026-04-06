import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { mkdirSync } from "fs";
import playwright from "playwright";
import { Browser, BrowserContext, Page } from "playwright";
import { CustomWorld } from "../helpers/CustomWorld";

declare global {
  var browser: Browser;
  var context: BrowserContext;
  var page: Page;
}


BeforeAll(async function () {
  for (const dir of ['reports', 'reports/screenshots', 
    'reports/traces', 'reports/videos',
  ]) {
    try {
      mkdirSync(dir, { recursive: true });
    } catch { }
  }
  console.log("Reports directories created/verified...");
});

Before(async function (this: CustomWorld, scenario) {
  this.scenarioName = scenario.pickle.name;
  console.log(`Starting: ${this.scenarioName}`);
  console.log("Launching up the browser...");
  await this.openBrowser();
});

After(async function (this: CustomWorld, scenario) {
  const failed = scenario.result?.status === "FAILED";
  if (failed) {
    console.log(`Scenario failed: ${this.scenarioName}`);
    try{
      const screenshotPath = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshotPath, "image/png");
    } catch {}
  } else {
    console.log(`Scenario passed: ${this.scenarioName}`);
  } 

  console.log("Close Context and Page");
  await this.closeBrowser(failed, this.scenarioName);
});

AfterAll(async function () {
  console.log("Global teardown completed...");
});