import {Pool} from 'pg';

const pool = new Pool({
    host: '192.169.0.98',
    user: 'root',
    password: 'pass',
    database: 'admin',
    port: 5432,
})

export default pool