import express from 'express'
// Importación de módulos siguiendo la Screaming Architecture para una buena organización
import * as controladorGuitarra from './modulos/guitarras/controlador.guitarras.mjs'
import * as controladorProcesos from './modulos/procesos/controlador.procesos.mjs'
import * as middlewares from './modulos/middlewares/controlador.middlewares.mjs'

const PUERTO = 3000
const app = express()

// Middleware incorporado de Express para parsear el body de las peticiones HTTP a formato JSON
app.use(express.json())

// Ruta raíz: Documentación básica de la API
app.get('/', (req, res) => {
    res.json({
        mensaje: 'endpoints disponibles',
        guitarras: '/api/v1/guitarras',
        guitarraId: '/api/v1/guitarras/:id (id: 1 al 15)',
        procedimiento: '/calcular-precio-total/:tipo (tipo: Electrica, Acustica, Electroacustica)'
    })
})

// 1- REST
// Implementación de endpoints siguiendo los principios de la arquitectura RESTful
app.get('/api/v1/guitarras', controladorGuitarra.obtenerGuitarras)

// Middleware de validación inyectado previo al controlador para garantizar la integridad del parámetro 'id'
app.get('/api/v1/guitarras/:id', middlewares.validarIdNumerico, controladorGuitarra.obtenerGuitarraId)

// 2- Orientado a Procedimientos
// Endpoint diseñado por fuera de las convenciones REST para ejecutar procesos específicos sobre los datos
app.get('/calcular-precio-total/:tipo', controladorProcesos.calcularPrecioTotalPorTipo)

// Manejo de errores (Fallback) ---
// Middleware de última instancia para capturar peticiones a recursos no definidos (HTTP 404)
app.use((req, res) => {
    res.status(404).json({
        mensaje: "Recurso no encontrado",
        ruta: req.originalUrl,
        raiz: `http://localhost:${PUERTO}/api/v1/guitarras/`
    })
})

app.listen(PUERTO, () => {
    console.log(`Raiz: http://localhost:${PUERTO}/`)
    console.log(`Guitarras: http://localhost:${PUERTO}/api/v1/guitarras/`)
    console.log(`Guitarras ID: http://localhost:${PUERTO}/api/v1/guitarras/1`)
    console.log(`Procedimiento: http://localhost:${PUERTO}/calcular-precio-total/Electrica`)
})