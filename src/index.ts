import moment from 'moment';
import Config from 'config';

import { Browser, Builder } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import { Matchup } from './datasources/common';
import { DraftKings } from './datasources/draftkings';

import Knex from './db/knex';

const options = new Options();

options.setChromeBinaryPath(Config.get<string>('chrome.binary_path'));

// These options are necessary if you'd like to deploy to Heroku
options.addArguments(
  '--headless',
  'user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--remote-debugging-port=9222',
  '--window-size=1920x1480'
);

async function main () {
  const serviceBuilder = new ServiceBuilder(Config.get<string>('chrome.driver_path'));
  
  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  const mlbMatchups: Matchup[] = [];
  const nflMatchups: Matchup[] = [];

  try {
    const draftKings = new DraftKings(driver);
    let startDay = moment().startOf('day');
    let oneDayMatchups: Matchup[] = [];

    // Retrieve all MLB Matchups
    do {
      oneDayMatchups = await draftKings.getMLBLines(startDay);
      startDay.add(1, 'day');

      console.log(oneDayMatchups);

      mlbMatchups.push(...oneDayMatchups);
    } while (oneDayMatchups.length > 0)

    // Retrieve all NFL Matchups
    startDay = moment().startOf('day');
    oneDayMatchups = [];
    do {
      oneDayMatchups = await draftKings.getNFLLines(startDay);
      startDay.add(1, 'day');

      nflMatchups.push(...oneDayMatchups);
    } while (oneDayMatchups.length > 0)
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }

  if (mlbMatchups.length > 0) {
    await Knex('Line_MLB').insert(mlbMatchups.map((matchup) => {
      return {
        home_team: matchup.home_team.name,
        away_team: matchup.away_team.name,
        home_line: `${matchup.home_line.favor}${matchup.home_line.odds}`,
        away_line: `${matchup.away_line.favor}${matchup.away_line.odds}`,
        date: matchup.date.toISOString()
      }
    }))
      .onConflict(['home_team', 'away_team', 'date'])
      .merge(['home_line', 'away_line', 'date'])
      .then((results: any) => {
        console.log(`Successfully inserted ${results.rowCount} entries to \`Line_MLB\``);
      });
  } else {
    console.log('No MLB matchups found');
  }

  if (nflMatchups.length > 0) {
    await Knex('Line_NFL').insert(nflMatchups.map((matchup) => {
      return {
        home_team: matchup.home_team.name,
        away_team: matchup.away_team.name,
        home_line: `${matchup.home_line.favor}${matchup.home_line.odds}`,
        away_line: `${matchup.away_line.favor}${matchup.away_line.odds}`,
        date: matchup.date.toISOString()
      }
    }))
      .onConflict(['home_team', 'away_team', 'date'])
      .merge(['home_line', 'away_line', 'date'])
      .then((results: any) => {
        console.log(`Successfully inserted ${results.rowCount} entries to \`Line_NFL\``);
      });
  } else {
    console.log('No NFL matchups found');
  }

  process.exit(0);
}

main();
