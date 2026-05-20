import { Router } from 'express'
import * as controlador from "./controlador.productos.mjs"

const rutasProductos = Router()

rutasProductos.get('/api/v1/productos', controlador.obtenerTodos)
rutasProductos.get('/api/v1/productos/:id', controlador.obtenerProducto)

export default rutasProductos