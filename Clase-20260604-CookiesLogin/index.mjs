import express from 'express'
import cookieParser from 'cookie-parser' 

const PUERTO = 3000

const app = express()

// Avisamos a express que use cookieParser
app.use(cookieParser('clavesecreta'))

// --- Para recibir datos desde el cliente
// JSON
app.use(express.json())
// URLENCODED
app.use(express.urlencoded({extended:true}))
// ---

// --- Mostrar front
// Admin
app.use('/admin', chequearCookie, express.static('./front-end/front-admin'))

// Login
app.use('/login', express.static('./front-end/front-login'))
// ---

// Ruta que va a gestionar la autenticacion y el acceso
app.post('/autenticacion', (req, res)=>{
    const { usuario, clave } = req.body
    // Consultar a la base de datos si el usuario existe
    if(usuario != 'admin' || clave != '54321'){
        res.redirect('/login')
    }

    // Genero el id
    // Lo guardo en algun lado, por ejemplo en la BD
    // Consulto el valor
    // Genera cabeceras para las cookies
    res.cookie('sesionId', 'minumerodesesion', {  // minumerodesesion se puede generar con nanoid
        signed: true, // Cookies firmadas
        httpOnly: true,
        sameSite: 'lax',
        secure: true, // Solo se mandan si es https
        maxAge: 1000 * 10
    })
    // res.send('Logeado')
    res.redirect('/admin')
})

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/admin`)
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/login`)
})


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