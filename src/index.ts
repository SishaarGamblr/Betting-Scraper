import dotenv from 'dotenv';

import { Browser, Builder, until } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';

dotenv.config({ path: `config/.env.${process.env.NODE_ENV ?? 'development'}` });

const options = new Options();

options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH as string);

// These options are necessary if you'd like to deploy to Heroku
// options.addArguments("--headless");
// options.addArguments("--disable-gpu");
// options.addArguments("--no-sandbox");

async function main () {
  const serviceBuilder = new ServiceBuilder(process.env.CHROME_DRIVER_PATH);
  
  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  try {
    const res1 = await driver.get('https://www.google.com');
    const res2 = await driver.wait(until.titleMatches(/Google/));
    const html = await driver.getPageSource();
    console.log(`HTML is:\n\n{}\n\n`, html);
  } finally {
    await driver.quit();
  }
}

main();