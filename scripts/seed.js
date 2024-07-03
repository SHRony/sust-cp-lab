const { Client } = require('pg')
require('dotenv').config();
const dbTables = {
  users: 'sust_cp_lab_users',
  cf_handles: 'sust_cp_lab_cf_handles',
  student_info: 'sust_cp_lab_student_info',
  mentor_info: 'sust_cp_lab_mentor_info',
  cf_cache: 'sust_cp_lab_cf_cache',
  contests: 'sust_cp_lab_contests',
  contest_registrations: 'sust_cp_lab_contestregistrations',
  teams : 'sust_cp_lab_teams',
  team_members: 'sust_cp_lab_team_members',
}
const client = new Client({
  connectionString: process.env.POSTGRES_URL ,
});
// const {
//   invoices,
//   customers,
//   revenue,
//   users,
// } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    // Create the "users" table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.users} (
        user_name VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
          CREATE TYPE user_type AS ENUM ('mentor', 'student', 'admin');
        END IF;
      END $$;
    `);
    await client.query(`
      ALTER TABLE ${dbTables.users}
      ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'student'
    `);

      // Insert data into the "users" table


  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
async function seedStudents(client) {
  try {
    // Create the "students" table if it doesn't exist

    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.student_info} (
        username VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        registration_no VARCHAR(10) NOT NULL,
        vjudge_handle VARCHAR(255)
      );
    `);
    console.log(`Created "student" table`);


  } catch (error) {
    console.error('Error seeding students:', error);
    throw error;
  }
}
async function seedCFHandles(client) {
  try {
    // Create the "cf_handles" table if it doesn't exist

    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.cf_handles} (
        username VARCHAR(255) NOT NULL,
        handle VARCHAR(255) NOT NULL
      );
    `);
    console.log(`Created "cf_handles" table`);


  } catch (error) {
    console.error('Error seeding cf_handles:', error);
    throw error;
  }
}

//write seedCFCache function which creates table named dbTables.cf_cache and columns are username and info which is a json object
async function seedCFCache(client) {
  try {
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.cf_cache} (
        username VARCHAR(255) NOT NULL PRIMARY KEY,
        info JSON
      );
    `);
    console.log(`Created "cf_cache" table`);
  } catch (error) {
    console.error('Error seeding cf_cache:', error);
    throw error;
  }
}

// seed contests table
async function seedContests(client) {
  try {
    // Create the "contests" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.contests} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        venue VARCHAR(35) NOT NULL,
        description VARCHAR(500) NOT NULL,
        type VARCHAR(35) NOT NULL,
        date VARCHAR(25) NOT NULL,
        poster VARCHAR(255)
      );
    `);
    console.log(`Created "contests" table`);
  } catch (error) {
    console.error('Error seeding contests:', error);
    throw error;
  }

  try {
    const alterTable = await client.query(`
      ALTER TABLE ${dbTables.contests}
      ADD COLUMN IF NOT EXISTS author VARCHAR(255) NOT NULL DEFAULT 'Rony';
    `);
    console.log(`Added author column to contests table`);
  } catch (error) {
    console.error('Error adding author column to contests table:', error);
    throw error;
  }
}
async function seedContestRegistrations(client) {
  try {
    // Create the "contest_registrations" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.contest_registrations} (
        contest_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        PRIMARY KEY (contest_id, user_name)
      );
    `);
    console.log(`Created "contest_registrations" table`);
  } catch (error) {
    console.error('Error seeding contest_registrations:', error);
    throw error;
  }
  
}
async function seedTeams(client) {
  try {
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.teams} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contest VARCHAR(255) NOT NULL
      );
    `);
    console.log(`Created "teams" table`);
  } catch (error) {
    console.error('Error seeding teams:', error);
    throw error;
  }
}
async function seedTeamMembers(client) {
  try {
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS ${dbTables.team_members} (
        team_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        UNIQUE (team_id, user_name)
      );
    `);
    console.log(`Created "team_members" table`);
  } catch (error) {
    console.error('Error seeding team_members:', error);
    throw error;
  }
}

// write a function which whill take table name and client as parameter and then drop that table if exists
async function dropTable(tableName, client) {
  try {
    const dropTable = await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    console.log(`Dropped ${tableName} table`);
  } catch (error) {
    console.error(`Error dropping ${tableName} table:`, error);
    throw error;
  }
}
async function main() {
  // const client = await db.connect();
  console.log(process.env.POSTGRES_URL);
  await client.connect(function(err) {
    if (err){
      throw err;
    }
    console.log("Connected!");
  });
  await seedUsers(client);
  await seedStudents(client);
  await seedCFHandles(client);
  await seedCFCache(client);
  await seedContests(client);
  await seedContestRegistrations(client);
  await seedTeams(client);
  await seedTeamMembers(client);
  await client.end();
}



main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});