import { table } from "console";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import moment from "moment";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import { Matchup, MLB_LineSource, NFL_LineSource } from "./common";

export class DraftKings implements MLB_LineSource, NFL_LineSource {
  private driver: ThenableWebDriver;

  private DEFAULT_TIMEOUT = 60000;

  constructor(driver: ThenableWebDriver) {
    this.driver = driver;
  }

  async getMLBLines(tableNum: number = 1): Promise<Matchup[]> {
    const targetURL = "https://sportsbook.draftkings.com/leagues/baseball/mlb";
    if ((await this.driver.getCurrentUrl()) !== targetURL) {
      await this.driver.get(targetURL);
      await this.driver.wait(
        until.titleMatches(/Betting Odds/),
        this.DEFAULT_TIMEOUT
      );
    }

    // Write screenshot
    // const filename = randomUUID().slice(0, 5) + '.png';
    // await writeFile(filename, await this.driver.takeScreenshot(), 'base64').then(() => { console.log(`Wrote ${filename}`)});
    // $ curl -F "file=@myfile.csv" https://file.io

    const matchups: Matchup[] = [];

    let matchup_index = 1;
    let hasErrored = false;

    while (!hasErrored) {
      try {
        const homeTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const homeLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const awayTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const awayLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const dateString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getMLBDateSelector()}`
            )
          )
          .then((element) => element.getText());

        const startTimeString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getStartTimeSelector()}`
            )
          )
          .then((element) => element.getText());

        console.debug(
          homeTeam,
          homeLine,
          awayTeam,
          awayLine,
          this.inferMomentFromDateAndTime(dateString, startTimeString)
        );

        matchups.push({
          home_team: {
            name: homeTeam,
          },
          away_team: {
            name: awayTeam,
          },
          home_line: {
            favor: homeLine.charAt(0),
            odds: parseInt(homeLine.slice(1)),
          },
          away_line: {
            favor: awayLine.charAt(0),
            odds: parseInt(awayLine.slice(1)),
          },
          date: this.inferMomentFromDateAndTime(dateString, startTimeString),
        });

        matchup_index += 2;
      } catch (err) {
        hasErrored = true;
      }
    }

    return matchups;
  }

  async getNFLLines(tableNum: number = 1): Promise<Matchup[]> {
    const targetURL = "https://sportsbook.draftkings.com/leagues/football/nfl";
    if ((await this.driver.getCurrentUrl()) !== targetURL) {
      await this.driver.get(targetURL);
      await this.driver.wait(
        until.titleMatches(/Betting Odds/),
        this.DEFAULT_TIMEOUT
      );
    }

    const matchups: Matchup[] = [];

    let matchup_index = 1;
    let hasErrored = false;

    while (!hasErrored) {
      try {
        const homeTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const homeLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const awayTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const awayLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const dateString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getNFLDateSelector()}`
            )
          )
          .then((element) => element.getText());

        const startTimeString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getStartTimeSelector()}`
            )
          )
          .then((element) => element.getText());

        console.debug(
          homeTeam,
          homeLine,
          awayTeam,
          awayLine,
          this.inferMomentFromDateAndTime(dateString, startTimeString)
        );

        matchups.push({
          home_team: {
            name: homeTeam,
          },
          away_team: {
            name: awayTeam,
          },
          home_line: {
            favor: homeLine.charAt(0),
            odds: parseInt(homeLine.slice(1)),
          },
          away_line: {
            favor: awayLine.charAt(0),
            odds: parseInt(awayLine.slice(1)),
          },
          date: this.inferMomentFromDateAndTime(dateString, startTimeString),
        });

        matchup_index += 2;
      } catch (err) {
        hasErrored = true;
      }
    }

    return matchups;
  }

  async getNBALines(tableNum: number = 1): Promise<Matchup[]> {
    const targetURL =
      "https://sportsbook.draftkings.com/leagues/basketball/nba";
    if ((await this.driver.getCurrentUrl()) !== targetURL) {
      await this.driver.get(targetURL);
      await this.driver.wait(
        until.titleMatches(/Betting Odds/),
        this.DEFAULT_TIMEOUT
      );
    }

    // Write screenshot
    // const filename = randomUUID().slice(0, 5) + '.png';
    // await writeFile(filename, await this.driver.takeScreenshot(), 'base64').then(() => { console.log(`Wrote ${filename}`)});
    // $ curl -F "file=@myfile.csv" https://file.io

    const matchups: Matchup[] = [];

    let matchup_index = 1;
    let hasErrored = false;

    while (!hasErrored) {
      try {
        const homeTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const homeLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const awayTeam = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getTeamNameSelector()}`
            )
          )
          .then((element) => element.getText());
        const awayLine = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index + 1
              )}${this.getLineSelector()}`
            )
          )
          .then((element) => element.getText());

        const dateString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getNBADateSelector()}`
            )
          )
          .then((element) => element.getText());

        const startTimeString = await this.driver
          .findElement(
            By.css(
              `${this.getTableSelector(tableNum)}${this.getRowSelector(
                matchup_index
              )}${this.getStartTimeSelector()}`
            )
          )
          .then((element) => element.getText());

        console.debug(
          homeTeam,
          homeLine,
          awayTeam,
          awayLine,
          this.inferMomentFromDateAndTime(dateString, startTimeString)
        );

        matchups.push({
          home_team: {
            name: homeTeam,
          },
          away_team: {
            name: awayTeam,
          },
          home_line: {
            favor: homeLine.charAt(0),
            odds: parseInt(homeLine.slice(1)),
          },
          away_line: {
            favor: awayLine.charAt(0),
            odds: parseInt(awayLine.slice(1)),
          },
          date: this.inferMomentFromDateAndTime(dateString, startTimeString),
        });

        matchup_index += 2;
      } catch (err) {
        hasErrored = true;
      }
    }

    return matchups;
  }

  private inferMomentFromDateAndTime(
    date: string,
    startTime?: string
  ): moment.Moment {
    let inferredMoment: moment.Moment;

    if (date.match(/TODAY/)) {
      inferredMoment = moment().startOf("day");
    } else if (date.match(/TOMORROW/)) {
      inferredMoment = moment().startOf("day").add(1, "day");
    } else if (date.match(/[A-Z]{3} [A-Z]{3}/)) {
      inferredMoment = moment(date.slice(4), "MMM Do");
    } else {
      throw new Error(`Unrecognized date format: ${date}`);
    }

    if (startTime) {
      inferredMoment = moment(
        `${inferredMoment.format("YYYY-MM-DD")} ${startTime}`,
        "YYYY-MM-DD h:mm A"
      );
    }

    return inferredMoment;
  }

  private getNFLDateSelector() {
    return `table > thead > tr > th.always-left.column-header > div > span > span`;
  }

  private getMLBDateSelector() {
    return `table > thead > tr > th.always-left.column-header > div > span > span > span`;
  }

  private getNBADateSelector() {
    return `table > thead > tr > th.always-left.column-header > div > span > span`;
  }
  private getStartTimeSelector() {
    return `th > a > div > div.event-cell__status > span`;
  }

  private getTableSelector(tableNum: number) {
    return `#root > section > section.sportsbook-wrapper__body > section > div.sportsbook-league-page__body > div > div.sportsbook-responsive-card-container__body > div > div > div.sportsbook-card-accordion__children-wrapper > div > div:nth-child(2) > div:nth-child(${tableNum}) > `;
  }

  private getRowSelector(row: number) {
    return `table > tbody > tr:nth-child(${row}) > `;
  }

  private getTeamNameSelector() {
    return `th > a > div > div.event-cell > div > span > div > div`;
  }

  private getLineSelector() {
    return `td:nth-child(4) > div > div > div > div > div:nth-child(2) > span`;
  }
}
