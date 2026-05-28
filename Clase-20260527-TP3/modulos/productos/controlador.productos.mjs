import * as modelo from "./modelo.productos.mjs"

export async function obtenerProductos(req, res){
    // Arreglo
    const productos = await modelo.obtenerProductos()
    if(productos.lenght === 0){
        res.status(404).json({ mensaje: 'Registros no encontrados' })
    }
    // Respuesta cliente
    res.json(productos)
}

export async function crearProducto(req, res){
    const datosProducto = req.body
    // Futuro esto va en la capa servicios <--- logica negocios
    // verificar datos que ingresan del cliente:
    // - Si es un numero/cadena, si no esta vacio, etc.
    const producto = await modelo.crearProducto(datosProducto)

    if(producto.length === 0){
        res.status(400).json({ mensaje: 'No se pudo dar de alta el registro' })
    }

    res.json({ 
                mensaje: 'Producto dado de alta', 
                producto: producto 
            })
}