import moment from 'moment';
import Config from 'config';

import { Browser, Builder } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import { Matchup } from './datasources/common';
import { DraftKings } from './datasources/draftkings';

import Knex from './db/knex';

const options = new Options();

options.setChromeBinaryPath(Config.get<string>('chrome.binary_path'));
options.addArguments("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36");

// These options are necessary if you'd like to deploy to Heroku
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");

async function main () {
  const serviceBuilder = new ServiceBuilder(Config.get<string>('chrome.driver_path'));
  
  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  let mlbMatchups: Matchup[] = [];
  let nflMatchups: Matchup[] = [];

  try {
    const draftKings = new DraftKings(driver);
    
    mlbMatchups = await draftKings.getMLBLines(moment());
    nflMatchups = await draftKings.getNFLLines(moment().add(25, 'hours'));
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }

  await Knex('lines_mlb').insert(mlbMatchups.map((matchup) => {
    return {
      home_team: matchup.home_team.name,
      away_team: matchup.away_team.name,
      home_line: `${matchup.home_line.favor}${matchup.home_line.odds}`,
      away_line: `${matchup.away_line.favor}${matchup.away_line.odds}`,
      date: matchup.date
    }
  })).then((results) => {
    console.log(`Successfully inserted ${results.length} entries to \`lines_mlb\``);
  });

  await Knex('lines_nfl').insert(nflMatchups.map((matchup) => {
    return {
      home_team: matchup.home_team.name,
      away_team: matchup.away_team.name,
      home_line: `${matchup.home_line.favor}${matchup.home_line.odds}`,
      away_line: `${matchup.away_line.favor}${matchup.away_line.odds}`,
      date: matchup.date
    }
  })).then((results) => {
    console.log(`Successfully inserted ${results.length} entries to \`lines_nfl\``);
  });

  process.exit(0);
}

main();
