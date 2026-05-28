import pool from "../../bd/conexion.bd.mjs"

export async function obtenerProductos(){
    const resultado = await pool.query('SELECT * FROM productos')
    return resultado.rows //Arreglo de resgistros
}

export async function crearProducto(datos){
    const { nombre, descripcion, categoria_id, destacado } = datos // asignacion destructurante

    const resultado = await pool.query(`INSERT INTO productos
                                            (nombre, descripcion, categoria_id, destacado)
                                        VALUES
                                            ($1, $2, $3, $4)
                                        RETURNING
                                            id, nombre, descripcion, categoria_id, destacado, activo, fecha_creacion`,
                                        [
                                            nombre,
                                            descripcion,
                                            categoria_id,
                                            destacado,
                                        ])
    return resultado.rows //Arreglo de resgistros
}