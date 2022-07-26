import moment from "moment";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import { LineSource, Matchup } from "./common";

export class DraftKings implements LineSource {

  private driver: ThenableWebDriver;

  constructor (driver: ThenableWebDriver) {
    this.driver = driver;
  }

  async getMLBLines (date: moment.Moment = moment()): Promise<Matchup[]> {
    try {
      await this.driver.get('https://sportsbook.draftkings.com/leagues/baseball/mlb');
      await this.driver.wait(until.titleMatches(/MLB Betting Odds & Lines/));

      const matchups: Matchup[] = [];
  
      let matchup_index = 1;
      let hasErrored = false;

      const dateDifference = date.diff(moment(), 'days', false) + 1; // We add 1 since this is supplied to CSS selector, which is 1-indexed

      while(!hasErrored) {
        try {
          const homeTeam = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
          const homeLine = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index)}${this.getLineSelector()}`)).then((element) => element.getText());
          
          const awayTeam = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index + 1)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
          const awayLine = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index + 1)}${this.getLineSelector()}`)).then((element) => element.getText());

          matchups.push({
            home: {
              name: homeTeam
            },
            away: {
              name: awayTeam
            },
            home_line: {
              favor: homeLine.charAt(0),
              odds: parseInt(homeLine.slice(1))
            },
            away_line: {
              favor: awayLine.charAt(0),
              odds: parseInt(awayLine.slice(1))
            },
            date: moment()
          })

          matchup_index += 2;
        } catch (err) {
          hasErrored = true;
        }
      }

      return matchups;
    } finally {
      await this.driver.quit();
    }
  }

  async getNFLLines(date: moment.Moment = moment()): Promise<Matchup[]> {
    try {
      await this.driver.get('https://sportsbook.draftkings.com/leagues/football/nfl');
      await this.driver.wait(until.titleMatches(/Betting Odds & Lines/));

      const matchups: Matchup[] = [];
  
      let matchup_index = 1;
      let hasErrored = false;

      const dateDifference = date.diff(moment(), 'days', false) + 1; // We add 1 since this is supplied to CSS selector, which is 1-indexed

      while(!hasErrored) {
        try {
          const homeTeam = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
          const homeLine = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index)}${this.getLineSelector()}`)).then((element) => element.getText());
          
          const awayTeam = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index + 1)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
          const awayLine = await this.driver.findElement(By.css(`${this.getTableSelector(dateDifference)}${this.getRowSelector(matchup_index + 1)}${this.getLineSelector()}`)).then((element) => element.getText());

          matchups.push({
            home: {
              name: homeTeam
            },
            away: {
              name: awayTeam
            },
            home_line: {
              favor: homeLine.charAt(0),
              odds: parseInt(homeLine.slice(1))
            },
            away_line: {
              favor: awayLine.charAt(0),
              odds: parseInt(awayLine.slice(1))
            },
            date: moment()
          })

          matchup_index += 2;
        } catch (err) {
          hasErrored = true;
        }
      }

      return matchups;
    } finally {
      await this.driver.quit();
    }
  }

  private getTableSelector(tableNum: number) {
    return `#root > section > section.sportsbook-wrapper__body > section > div.sportsbook-league-page__body > div > div.sportsbook-responsive-card-container__body > div > div > div.sportsbook-card-accordion__children-wrapper > div > div:nth-child(2) > div:nth-child(${tableNum})`;
  }
  
  private getRowSelector (row: number) {
    return ` > table > tbody > tr:nth-child(${row}) > `;
  }
  
  private getTeamNameSelector() {
    return `th > a > div > div.event-cell__team-info > span > div > div`;
  }
  
  private getLineSelector() {
    return `td:nth-child(4) > div > div > div > div > div:nth-child(2) > span`;
  }

}