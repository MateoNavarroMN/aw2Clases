import express from 'express';
import pool from './conexion.bd.mjs';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid'

const PUERTO = 3000;

////////////////

////////////////
const app = express();

app.use(express.json()) // <-- formato JSON -> convierte en Objeto dentro de body
app.use(express.urlencoded({ extended: true })) // <-- formato urlencoder -> convierte en Objeto dentro de body
app.use(cookieParser('clavesecreta'))

// Middleware para bloquer acceso
async function chequearCookie(req, res, next) {
    // verifico si la cookie existe
    const sesionId = req.signedCookies['sesionId']

    // Verifico si el valor enviado por el cliente coincide con lo que tenemos en el servidor
    if (!sesionId) {
        return res.redirect('/login')
    }

    try {
        const resultado = await pool.query(`
            SELECT * 
            FROM usuarios 
            WHERE session_id = $1`, 
            [sesionId]
        )

        if (resultado.rowCount > 0) {
            return next()
        }

    } catch (error) {
        console.log(error)
    }

    return res.redirect('/login')
}


//// Exponemos los dos fronts
// Admin CRUD
app.use('/admin', chequearCookie, express.static('./fronts/front-admin'))

// Login
app.use('/login', express.static('./fronts/front-login'))

// Autenticar
app.post('/autenticacion', async (req, res) => {
    // Actividad 5
    // Generar el id con nanoid

    const { usuario, pass } = req.body

    try {
        const resultado = await pool.query(`
                SELECT * 
                FROM usuarios 
                WHERE username = $1
            `,
            [usuario]
        )

        if (resultado.rowCount === 0) {
            return res.redirect('/login')
        }

        const user = resultado.rows[0]
        const comparar = await bcrypt.compare(pass, user.password_hash)

        if (!comparar) {
            return res.redirect('/login')
        }

        const sesionId = nanoid()

        await pool.query(`
            UPDATE usuarios 
            SET session_id = $1 
            WHERE id = $2
            `,
            [sesionId, user.id]
        )

        res.cookie('sesionId', sesionId, {
            signed: true,
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Solo se mandan si es https
            maxAge: 1000 * 60 * 60 // 1 hora
        })

        res.redirect('/admin')

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
})


// Registrar
app.post('/registrar', async (req, res) => {
    // 1 - Capturar datos
    // console.log(req.body) // <-- tanto json y urlencoder se guardan aqui
    const { usuario, pass } = req.body  // Se puede cambiar el nombre de la variable ej: {usuario: user, pass} 

    // 2 - Control
    if (!usuario || !pass) {
        return res.status(400).json({ mensaje: 'Datos incompletos' })
    }

    // 3 - Encriptamos clave
    const salt = await bcrypt.genSalt(10); // <-- Previene el ataque de fuerza bruta 
    const hash = await bcrypt.hash(pass, salt);
    console.log(hash)

    // 4 - Guardamos en bd
    const resultado = await pool.query(`
                    INSERT INTO usuarios
                        (username, password_hash)
                    VALUES
                        ($1, $2)
                    RETURNING
                        (id, username)
                    `,
        [usuario, hash]
    )

    // console.log(resultado)
    // 5 - Verificamos si se realizo la insercion
    if (resultado.rowCount > 0) {
        return res.json({
            mensaje: `El usuario ${usuario} se ha registrado con exito`
        })
    }

    res.status(500).json({
        mensaje: 'El registro no se pudo realizar'
    })
})

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/login`)
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/admin`)
});
