// import pg from 'pg'
import { Pool } from 'pg'

const pool = new Pool({
    host:'localhost',
    database: 'tienda',
    user: 'root',
    password: 'pass',
    port: 5432
})

export default pool