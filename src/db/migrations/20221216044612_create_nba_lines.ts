import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Line_NBA', (table) => {
    table.increments('id');
    table.string('home_team').notNullable();
    table.string('away_team').notNullable();
    table.string('home_line').notNullable();
    table.string('away_line').notNullable();
    table.datetime('date').notNullable();
    table.datetime('createdAt');
    table.datetime('updatedAt');
    table.primary(['home_team', 'away_team', 'date']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Line_NBA');
}

