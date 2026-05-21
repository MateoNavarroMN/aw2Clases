import * as modelo from './modelo.productos.mjs'
import * as vista from './vista.productos.mjs'

export async function obtenerTodos(req, res) {
    const productos = await modelo.obtenerTodos() // <-- Datos completos
    const respuestaVista = vista.obtenerTodos(productos) // <-- Array
    // Tener un criterio de datos a enviar
    res.status(200).json(respuestaVista)
}

export async function obtenerProducto(req, res) {
    const id = Number(req.params.id)

    const producto = await modelo.obtenerProducto(id) // <-- Array
    const resultado = vista.obtenerProdcuto(producto)

    if (resultado.length > 0) {
        res.status(200).json(resultado)
    } else {
        res.status(404).json({ mensaje: `Producto con id ${id} no encontrado` })
    }
}

export async function eliminarProducto(req, res) {
    const id = Number(req.params.id)

    const producto = await modelo.eliminarProducto(id) // <-- Array
    const resultado = vista.eliminarProducto(producto)

    if (resultado.length > 0) {
        res.status(200).json(resultado)
    } else {
        res.status(404).json({ mensaje: `Producto con id ${id} no encontrado` })
    }
}