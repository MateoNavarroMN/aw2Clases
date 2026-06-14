import { Router } from 'express'
import * as controladorGuitarra from './controlador.guitarras.mjs'
import * as middlewares from '../middlewares/controlador.middlewares.mjs'

const rutasGuitarras = new Router()

// 1- REST
// Implementación de endpoints siguiendo los principios de la arquitectura RESTful
rutasGuitarras.get('/api/v1/guitarras', controladorGuitarra.obtenerGuitarras)

// Middleware de validación inyectado previo al controlador para garantizar la integridad del parámetro 'id'
rutasGuitarras.get('/api/v1/guitarras/:id', middlewares.validarIdNumerico, controladorGuitarra.obtenerGuitarraId)


export default rutasGuitarras 