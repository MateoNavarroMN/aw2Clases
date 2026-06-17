import express from 'express'
import cookieParser from 'cookie-parser'
import './iniciar.env.mjs'

// Importación de módulos siguiendo la Screaming Architecture para una buena organización
import rutasGuitarras from './modulos/guitarras/rutas.guitarras.mjs'
import rutasProcesos from './modulos/procesos/rutas.procesos.mjs'
import rutasLogin from './modulos/auth/rutas.auth.mjs'
import * as middleware from './modulos/middlewares/controlador.middlewares.mjs'

const PUERTO = process.env.PUERTO || 3000

const app = express()

// Middleware incorporado de Express para parsear el body de las peticiones HTTP a formato JSON
app.use(express.json())
// Habilitamos la firma de cookies con el .env
app.use(cookieParser(process.env.FIRMA_COOKIE))


app.use('/login', express.static('./fronts/front-login'))

// Endpoints Login y Cerrar Sesion
app.use(rutasLogin)

app.use('/', middleware.comprobarToken, express.static('./fronts/front-paginas'))

// Endpoints REST y Procedimiento
app.use(middleware.comprobarToken, rutasGuitarras)
app.use(middleware.comprobarToken, rutasProcesos)


// Manejo de errores (Fallback)
// Middleware de última instancia para capturar peticiones a recursos no definidos (HTTP 404)
app.use((req, res) => {
    res.status(404).json({
        mensaje: "Recurso no encontrado",
        ruta: req.originalUrl,
        raiz: `http://localhost:${PUERTO}`
    })
})

app.listen(PUERTO, () => {
    console.log(`Guitarras: http://localhost:${PUERTO}`)
    console.log(`Guitarra ID 1: http://localhost:${PUERTO}/guitarra.html?id=1`)
    console.log(`Procedimiento: http://localhost:${PUERTO}/procedimiento.html`)
})