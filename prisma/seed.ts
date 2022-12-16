import moment from 'moment';
import prisma from '../src/lib/prisma';

async function main () {
  await prisma.line_MLB.createMany({
    data: [
      {
        id: 1,
        home_team: 'CLE Guardians',
        away_team: 'BOS Red Sox',
        home_line: '+115',
        away_line: '-135',
        date: moment('2022-07-26 17:00:00.000').toISOString()
      },
      {
        id: 2,
        home_team: 'PHI Phillies',
        away_team: 'PIT Pirates',
        home_line: '-200',
        away_line: '+170',
        date: moment('2022-07-27 17:00:00.000').toISOString()
      },
      {
        id: 3,
        home_team: 'CIN Reds',
        away_team: 'MIA Marlins',
        home_line: '+100',
        away_line: '-120',
        date: moment('2022-07-31 17:00:00.000').toISOString()
      },
      {
        id: 4,
        home_team: 'BAL Orioles',
        away_team: 'TEX Rangers',
        home_line: '+150',
        away_line: '-175',
        date: moment('2022-08-01 17:00:00.000').toISOString()
      }
    ]
  });

  await prisma.line_NFL.createMany({
    data: [
      {
        id: 1,
        home_team: 'BUF Bills',
        away_team: 'LA Rams',
        home_line: '-125',
        away_line: '+105',
        date: moment('2022-09-08 17:00:00.000').toISOString()
      },
      {
        id: 2,
        home_team: 'CLE Browns',
        away_team: 'CAR Panthers',
        home_line: '-115',
        away_line: '-105',
        date: moment('2022-09-10 17:00:00.000').toISOString()
      },
      {
        id: 3,
        home_team: 'TB Buccaneers',
        away_team: 'DAL Cowboys',
        home_line: '-125',
        away_line: '+105',
        date: moment('2022-09-11 17:00:00.000').toISOString()
      },
      {
        id: 4,
        home_team: 'DEN Broncos',
        away_team: 'SEA Seahawks',
        home_line: '-195',
        away_line: '+165',
        date: moment('2022-09-12 17:00:00.000').toISOString()
      }
    ]
  });
}

main()
