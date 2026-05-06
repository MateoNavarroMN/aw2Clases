import productos from "./productos.mjs"

export function obtenerProductos(req, res) {
    res.json(productos)
}

export function obtenerProductoID(req, res) {
    const idProducto = Number(req.params.id) // -> Verificar si es un numero -> Cast -> NaN
    // const idProducto = parseInt(req.params.id) // -> 123abc -> 123

    const productoFiltrado = productos.filter((producto) => {
        return idProducto === Number(producto.id)
    })

    // Logica Verificar si hay producto
    if (productoFiltrado.length > 0) {
        res.json(productoFiltrado)
    } else {
        res
            .status(404)
            .json({ mensaje: "Producto no encontrado" })
    }
}

export function eliminarProductoID(req, res) {
    const idProducto = Number(req.params.id) // -> Verificar si es un numero -> Cast -> NaN

    const productoFiltrado = productos.filter((producto) => {
        return idProducto !== Number(producto.id)
    })

    // Esto no se hace, solo es un ej de delete
    productos.length = 0
    productos.push(...productoFiltrado)
    //
    res.json({ mensaje: "Producto eliminado" })
}

export function altaProducto(req, res) {

    const nuevoProd = req.body
    productos.push(nuevoProd)
    res.json({ mensaje: "Producto dado de alta" })
}