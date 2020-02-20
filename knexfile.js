require('dotenv').config();

let options = {

    development: {
        client: process.env.DB_CONNECTION,
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'database/migrations'
        },
        seeds: {
            directory: 'database/seeds'
        }
    },

    production: {
        client: process.env.DB_CONNECTION,
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'database/migrations'
        }
    }

};

module.exports = options[process.env.NODE_ENV];
