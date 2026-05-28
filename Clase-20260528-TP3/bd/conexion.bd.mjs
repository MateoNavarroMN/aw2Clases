import pg from 'pg'
import '../iniciar.env.mjs'

const pool = new pg.Pool({
    host: process.env.HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_BD,
    port: process.env.BD_PUERTO
})

export default pool