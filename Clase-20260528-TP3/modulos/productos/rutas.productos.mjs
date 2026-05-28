import { Router } from "express"
import * as controlador from "./controlador.productos.mjs"

const rutasProductos = new Router()

rutasProductos.get('/api/v1/productos', controlador.obtenerProductos )

rutasProductos.post('/api/v1/productos', controlador.crearProducto )

export default rutasProductos