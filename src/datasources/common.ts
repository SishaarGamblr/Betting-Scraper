import moment from 'moment';
export interface Team {
  name: string
}

export interface Line {
  favor: string,
  odds: number
}

export interface Matchup {
  home: Team,
  away: Team,
  home_line: Line,
  away_line: Line,
  date: moment.Moment
}

export interface LineSource {
  getMLBLines (): Promise<Matchup[]>;
  getNFLLines (): Promise<Matchup[]>
}

