// import productos from "../../productos.mjs"
import pool from "../conexion.bd.mjs"

export async function obtenerTodos() {
    // Haria una consulta a una bd
    const resultado = await pool.query('SELECT * FROM productos')
    // console.log(resultado) 

    return resultado.rows
}

export async function obtenerProducto(id){
    const resultado = await pool.query(`SELECT * FROM productos WHERE id=$1`, [id])

    return resultado.rows
}

export async function eliminarProducto(id) {
    const resultado = await pool.query(`DELETE FROM productos WHERE id=$1 RETURNING id, producto, precio`, [id])

    return resultado.rows
}