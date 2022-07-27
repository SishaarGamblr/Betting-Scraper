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

export interface MLB_LineSource {
  getMLBLines (): Promise<Matchup[]>;
}

export interface NFL_LineSource {
  getNFLLines (): Promise<Matchup[]>
}

