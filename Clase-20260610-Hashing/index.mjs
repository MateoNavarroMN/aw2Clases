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

    const { usuario, pass } = req.body

    const resultado = await pool.query(`
                    SELECT * 
                    FROM usuarios
                    WHERE usuario = $1 AND password_hash = $2
                    RETURNING
                        (id, username, password_hash)
                    `,
        [usuario, pass]
    )

    const comparar = await bcrypt.compare(pass, resultado['password_hash'])

    if(!comparar){
        res.redirect('/login')
    }

    res.cookie('sesionId', 'minumerodesesion', {  // minumerodesesion se puede generar con nanoid
        signed: true, // Cookies firmadas
        httpOnly: true,
        sameSite: 'lax',
        secure: true, // Solo se mandan si es https
        maxAge: 1000 * 10
    })

    res.redirect('/admin')
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

// Middleware para bloquer acceso
function chequearCookie(req, res, next){
    // verifico si la cookie existe
    const sesionId = req.signedCookies['sesionId']

    // Verifico si el valor enviado por el cliente coincide con lo que tenemos en el servidor
    if(sesionId === 'minumerodesesion'){
        return next()
    }

    return res.redirect('/login')
}
