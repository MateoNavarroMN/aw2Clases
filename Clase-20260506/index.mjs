import express from 'express'
import { obtenerProductos, obtenerProductoID, eliminarProductoID, altaProducto } from './funciones.mjs'

const PUERTO = 3000

const app = express()
app.use(express.json()) // ---> avisar a express que voy a mandar datos del tipo JSON por el cuerpo de 

// Configuracion de una API REST

// GET /api/v1/productos
app.get('/api/v1/productos', obtenerProductos)

// GET /api/v1/productos/:id
app.get('/api/v1/productos/:id', obtenerProductoID)

// POST /api/v1/productos ---> Damos de alta un registro
app.post('/api/v1/productos', altaProducto)
// PUT /api/v1/productos/:id ---> Modificar un registro

// DELETE /api/v1/productos/:id ---> Eliminar un registro
app.delete('/api/v1/productos/:id',eliminarProductoID)


app.listen(PUERTO, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})