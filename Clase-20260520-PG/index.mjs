import express from 'express'
// import * as controlador from './modulos/productos/controlador.productos.mjs'

import rutasProductos from './modulos/productos/rutas.productos.mjs'

const PUERTO = 3000

const app = express()

// app.get('/api/v1/productos', controlador.obtenerTodos)
// app.get('/api/v1/productos/:id', controlador.obtenerProducto)

app.use(rutasProductos)

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/api/v1/productos`)
})          