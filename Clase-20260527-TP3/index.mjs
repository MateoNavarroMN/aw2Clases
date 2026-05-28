import express from 'express'
import './iniciar.env.mjs'
import rutasProductos from './modulos/productos/rutas.productos.mjs'

const PUERTO = process.env.PUERTO || 3000

const app = express()
app.use(express.json())
app.use(rutasProductos)

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PUERTO}/api/v1/productos`)
})          