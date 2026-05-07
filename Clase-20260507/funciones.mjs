import productos from "./productos.mjs"

export function obtenerProductos(req, res) {
    res.json(productos.datos)
}

export function obtenerProductoID(req, res) {
    const idProducto = Number(req.params.id) // -> Verificar si es un numero -> Cast -> NaN
    // const idProducto = parseInt(req.params.id) // -> 123abc -> 123

    const productoFiltrado = productos.datos.filter((producto) => {
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

export function altaProducto(req, res) {

    const nuevoProd = req.body
    const proximoID = Number(productos.ultimo_id) + 1
    nuevoProd.id = proximoID.toString()
    productos.ultimo_id = proximoID.toString()

    productos.datos.push(nuevoProd)
    res.json({ mensaje: "Producto dado de alta" })
}

// export function modificarProductoID(req, res) {
//     const idProducto = Number(req.params.id)
//     const productoDatos = req.body

//     productos.datos.forEach((prod)=>{
//         //obteniendo el indice con index()
//         const indice = productos.datos.indice(prod)

//         if(idProducto === Number(prod.id)){
//             productoDatos.id = idProducto
//             productos.datos[indice] = productoDatos
//         }
//     })

//     res.json({ mensaje: `Producto modificado con ${idProducto}`})
// }

export function eliminarProductoID(req, res) {
    const idProducto = Number(req.params.id) // -> Verificar si es un numero -> Cast -> NaN

    const productoFiltrado = productos.datos.filter((producto) => {
        return idProducto !== Number(producto.id)
    })

    // Esto no se hace, solo es un ej de delete
    productos.datos.length = 0
    productos.datos.push(...productoFiltrado)
    //
    res.json({ mensaje: "Producto eliminado" })
}