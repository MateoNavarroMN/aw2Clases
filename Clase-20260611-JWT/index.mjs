// Token de acceso TID AW2 p.366

import './iniciar.env.mjs'
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import pool from './conexion.bd.mjs';
import jwt from 'jsonwebtoken'

const PUERTO = process.env.PUERTO || 4000;

const app = express();

// Middleware que se ejecuta antes de entrar a /admin
function comprobarToken(req, res, next){
    // obtenemos el token desde la cookie
    const token = req.signedCookies ['token']
    jwt.verify(token, process.env.FIRMA_JWT, (error, payload)=>{
        // si el token no es valido
        if(error) return res.redirect('/login')
        
        console.log(payload)
        // si es valido lo dejamos pasar
        next()
    })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.FIRMA_COOKIE)); // <-- si esta firmada la guarda en: signedCookies - sino esta firmada en: cookies

app.post('/registrar', async (req, res) => {
    const { usuario, pass } = req.body;
    if (!usuario || !pass) {
        return res.sendStatus(400);
    }
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashingPass = bcrypt.hashSync(pass, salt);
        const resultado = await pool.query(
            'INSERT INTO usuarios (username, password_hash) VALUES ($1, $2)',
            [usuario, hashingPass]
        );
        if (resultado.rowCount > 0) {
            res.redirect('/login'); // Redirigimos al usuario a la página de login
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/autenticar', (req, res) => {
    const { usuario, pass } = req.body
    // -> consultar a la BD

    const datosPayload = {
        usuario: usuario,
        rol: 0
    }

    if (true) {
        jwt.sign(datosPayload, process.env.FIRMA_JWT, { expiresIn: '1h' }, (error, token) => {
            if (error) return res.redirect('/login')

            // Enviar token via cookie
            res.cookie('token', token, {
                sameSite: 'lax',
                httpOnly: true,
                secure: true,
                signed: true
            })

            return res.redirect('/admin')

            // console.log(token)
        })
    }
})

// Admin
app.use('/admin', comprobarToken, express.static('./fronts/front-admin'))

// Login
app.use('/login', express.static('./fronts/front-login'))

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PUERTO}`);
});
