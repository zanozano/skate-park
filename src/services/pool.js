const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '0750manzano',
    database: 'skatepark',
    port: 5432,
});

module.exports = pool;
