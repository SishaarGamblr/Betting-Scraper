import moment from "moment";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import { Matchup, MLB_LineSource, NFL_LineSource } from "./common";

export class DraftKings implements MLB_LineSource, NFL_LineSource {

  private driver: ThenableWebDriver;

  constructor (driver: ThenableWebDriver) {
    this.driver = driver;
  }

  async getMLBLines (currentDate: moment.Moment = moment()): Promise<Matchup[]> {
    const targetURL = 'https://sportsbook.draftkings.com/leagues/baseball/mlb';
    if (await this.driver.getCurrentUrl() !== targetURL) {
      await this.driver.get(targetURL);
      await this.driver.wait(until.titleMatches(/Betting Odds & Lines/));
    }

    const matchups: Matchup[] = [];
  
    let matchup_index = 1;
    let hasErrored = false;

    const tableNum = currentDate.diff(moment().startOf('day'), 'days', false) + 1; // We add 1 since this is supplied to CSS selector, which is 1-indexed

    console.log(tableNum);

    while(!hasErrored) {
      try {
        const homeTeam = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
        const homeLine = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index)}${this.getLineSelector()}`)).then((element) => element.getText());
        
        const awayTeam = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index + 1)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
        const awayLine = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index + 1)}${this.getLineSelector()}`)).then((element) => element.getText());

        const dateString = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getMLBDateSelector()}`)).then((element) => element.getText());

        matchups.push({
          home_team: {
            name: homeTeam
          },
          away_team: {
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
          date: this.inferDateFromString(dateString)
        })

        matchup_index += 2;
      } catch (err) {
        hasErrored = true;
      }
    }

    return matchups;
  }

  async getNFLLines(currentDate: moment.Moment = moment()): Promise<Matchup[]> {
    const targetURL = 'https://sportsbook.draftkings.com/leagues/football/nfl';
    if (await this.driver.getCurrentUrl() !== targetURL) {
      await this.driver.get(targetURL);
      await this.driver.wait(until.titleMatches(/Betting Odds & Lines/));
    }
    
    const matchups: Matchup[] = [];
  
    let matchup_index = 1;
    let hasErrored = false;

    const tableNum = currentDate.diff(moment().startOf('day'), 'days', false) + 1; // We add 1 since this is supplied to CSS selector, which is 1-indexed

    while(!hasErrored) {
      try {
        const homeTeam = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
        const homeLine = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index)}${this.getLineSelector()}`)).then((element) => element.getText());
        
        const awayTeam = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index + 1)}${this.getTeamNameSelector()}`)).then((element) => element.getText());
        const awayLine = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getRowSelector(matchup_index + 1)}${this.getLineSelector()}`)).then((element) => element.getText());

        const dateString = await this.driver.findElement(By.css(`${this.getTableSelector(tableNum)}${this.getNFLDateSelector()}`)).then((element) => element.getText());

        matchups.push({
          home_team: {
            name: homeTeam
          },
          away_team: {
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
          date: this.inferDateFromString(dateString)
        });

        matchup_index += 2;
      } catch (err) {
        hasErrored = true;
      }
    }

    return matchups;
  }

  private inferDateFromString(dateString: string): moment.Moment {
    if (dateString.match(/TODAY/)) {
      return moment().startOf('day');
    }

    if (dateString.match(/TOMORROW/)) {
      return moment().startOf('day').add(1, 'day');
    }

    if (dateString.match(/[A-Z]{3} [A-Z]{3}/)) {
      return moment(dateString.slice(4), 'MMM Do');
    }

    throw new Error(`Unrecognized date format: ${dateString}`);
  }

  private getNFLDateSelector() {
    return `table > thead > tr > th.always-left.column-header > div > span > span`;
  }

  private getMLBDateSelector() {
    return `table > thead > tr > th.always-left.column-header > div > span > span > span`;
  }

  private getTableSelector(tableNum: number) {
    return `#root > section > section.sportsbook-wrapper__body > section > div.sportsbook-league-page__body > div > div.sportsbook-responsive-card-container__body > div > div > div.sportsbook-card-accordion__children-wrapper > div > div:nth-child(2) > div:nth-child(${tableNum})  > `;
  }
  
  private getRowSelector (row: number) {
    return `table > tbody > tr:nth-child(${row}) > `;
  }
  
  private getTeamNameSelector() {
    return `th > a > div > div.event-cell__team-info > span > div > div`;
  }
  
  private getLineSelector() {
    return `td:nth-child(4) > div > div > div > div > div:nth-child(2) > span`;
  }

}