import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lines_mlb', (table) => {
    table.increments('id').primary();
    table.string('home_team').notNullable();
    table.string('away_team').notNullable();
    table.string('home_line').notNullable();
    table.string('away_line').notNullable();
    table.datetime('date').notNullable();
  });

  await knex.schema.createTable('lines_nfl', (table) => {
    table.increments('id').primary();
    table.string('home_team').notNullable();
    table.string('away_team').notNullable();
    table.string('home_line').notNullable();
    table.string('away_line').notNullable();
    table.datetime('date').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lines_mlb');
  await knex.schema.dropTable('lines_nfl');
}

