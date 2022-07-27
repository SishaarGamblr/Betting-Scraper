import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lines_mlb', (table) => {
    table.increments('id');
    table.string('home_team').notNullable();
    table.string('away_team').notNullable();
    table.string('home_line').notNullable();
    table.string('away_line').notNullable();
    table.datetime('date').notNullable();
    table.primary(['home_team', 'away_team', 'date']);
  });

  await knex.schema.createTable('lines_nfl', (table) => {
    table.increments('id');
    table.string('home_team').notNullable();
    table.string('away_team').notNullable();
    table.string('home_line').notNullable();
    table.string('away_line').notNullable();
    table.datetime('date').notNullable();
    table.primary(['home_team', 'away_team', 'date']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lines_mlb');
  await knex.schema.dropTable('lines_nfl');
}

