import express from 'express';
import pool from './conexion.bd.mjs';
import cookieParser from 'cookie-parser';
import bcrypt, { hash } from 'bcryptjs';

const PUERTO = 3000;

////////////////

////////////////
const app = express();
app.use(express.json()) // <-- formato JSON -> convierte en Objeto dentro de body
app.use(express.urlencoded({ extended: true })) // <-- formato urlencoder -> convierte en Objeto dentro de body

// Exponemos los dos fronts

// Admin CRUD
app.use('/admin', express.static('./fronts/front-admin'))

// Login
app.use('/login', express.static('./fronts/front-login'))

// Autenticar
app.post('/autenticacion', (req, res)   =>{
    // Actividad 5
    // Generar el id con nanoid
})


// Registrar
app.post('/registrar', async (req, res) => {
    // 1 - Capturar datos
    console.log(req.body) // <-- tanton json y urlencoder se guardan aqui
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
    
    console.log(resultado   )
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
    console.log(`Servidor escuchando en el puerto http://localhost:${PUERTO}`);
});