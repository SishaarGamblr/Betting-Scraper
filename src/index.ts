import dotenv from 'dotenv';
import moment from 'moment';

import { Browser, Builder, By, until } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import { DraftKings } from './datasources/draftkings';

dotenv.config({ path: `config/.env.${process.env.NODE_ENV ?? 'development'}` });

const options = new Options();

options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH as string);
options.addArguments("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36");

// These options are necessary if you'd like to deploy to Heroku
options.addArguments("--headless");
// options.addArguments("--disable-gpu");
// options.addArguments("--no-sandbox");

async function main () {
  const serviceBuilder = new ServiceBuilder(process.env.CHROME_DRIVER_PATH);
  
  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  const draftKings = new DraftKings(driver);
    
  // const matchups = await draftKings.getMLBLines(moment().add(25, 'hours'));
  const matchups = await draftKings.getNFLLines(moment().add(25, 'hours'));

  console.log(matchups);
}

main();
