import pool from "../../bd/conexion.bd.mjs"

export async function obtenerProductos() {
    const resultado = await pool.query('SELECT * FROM productos')
    return resultado.rows //Arreglo de resgistros
}

export async function crearProducto(datos) {
    const { nombre, descripcion, precio, categoria_id, destacado } = datos // asignacion destructurante

    const resultado = await pool.query(
        `INSERT INTO productos(nombre, descripcion, precio, categoria_id, destacado)
         VALUES($1, $2, $3, $4, $5)
         RETURNING id, nombre, descripcion, precio, categoria_id, destacado, activo, fecha_creacion`,
        [
            nombre,
            descripcion,
            precio,
            categoria_id,
            destacado,
        ])
        
    return resultado.rows //Arreglo de resgistros
}