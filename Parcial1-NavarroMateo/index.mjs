import express from 'express'
import { obtenerGuitarras, obtenerGuitarraId } from './src/controladores/guitarras.controlador.mjs'
import { calcularPrecioTotalPorTipo } from './src/controladores/procesos.controlador.mjs'
import { validarIdNumerico } from './src/middlewares/api.middleware.mjs'

const PUERTO = 3000
const app = express()

// Middleware a nivel de aplicación para parsear el body de las peticiones HTTP a formato JSON
app.use(express.json())

// Endpoint raiz que expone la documentación de la API
app.get('/', (req, res) => {
    res.json({
        mensaje: 'endpoints disponibles',
        guitarras: '/api/v1/guitarras',
        guitarraId: '/api/v1/guitarras/:id (id: 1 al 15)',
        proceso: '/calcular-precio-total/:tipo (tipo: Electrica, Acustica, Electroacustica)'
    })
})

// 1- REST
// Exponen los recursos siguiendo los principios de la arquitectura REST
app.get('/api/v1/guitarras', obtenerGuitarras)

// Se inyecta el middleware propio antes del controlador para validar el parametro
app.get('/api/v1/guitarras/:id', validarIdNumerico, obtenerGuitarraId)

// 2- Ruta procedural, no REST
// Endpoint orientado a procesos, diseñado por fuera de las convenciones estrictas de REST
app.get('/calcular-precio-total/:tipo', calcularPrecioTotalPorTipo)

// Manejador global para rutas no definidas (Fallback HTTP 404 Not Found)
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        mensaje: `El endpoint ${req.originalUrl} no existe en esta API.`
    })
})

app.listen(PUERTO, () => {
    console.log(`Servidor de [Parcial 1] corriendo en http://localhost:${PUERTO}`)
    console.log(`Servidor de [Parcial 1] corriendo en http://localhost:${PUERTO}/api/v1/guitarras`)
    console.log(`Servidor de [Parcial 1] corriendo en http://localhost:${PUERTO}/calcular-precio-total/electrica`)
})