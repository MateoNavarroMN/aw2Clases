import pool from "../../datos/conexion.bd.mjs"

export async function obtenerUsuarioPorNombre(usuario) {
    try {
        // Uso de consultas parametrizadas ($1) proporcionadas por la librería 'pg'.
        // Esto es crucial para la seguridad, ya que sanitiza las entradas y previene ataques de Inyección SQL.
        const resultado = await pool.query(`
                SELECT *
                FROM usuarios
                WHERE username = $1
            `,
            [usuario]
        )

        return resultado.rows[0] // Retorna el objeto del usuario hallado o undefined si no hay coincidencias
    } catch (error) {
        console.log(error)
    }
}

export async function guardarSessionId(id, sessionId) {
    try {
        // Actualización de estado en la BD para implementar una gestión de sesiones controlada desde el servidor (Stateful)
        const resultado = await pool.query(`
                UPDATE usuarios
                SET session_id = $1
                WHERE id = $2
            `,
            [sessionId, id]
        )
    } catch (error) {
        console.log(error)
    }
}

export async function obtenerUsuarioPorSessionId(sessionId) {
    try {
        // Validación contra la base de datos para comprobar que la sesión no haya sido revocada manualmente
        const resultado = await pool.query(`
                SELECT *
                FROM usuarios
                WHERE session_id = $1
            `,
            [sessionId]
        )

        return resultado.rows[0]
    } catch (error) {
        console.log(error)
    }
}

export async function eliminarSessionId(sessionId) {
    try {
        // Destrucción de la sesión en la capa de persistencia (anula el token asignando NULL)
        const resultado = await pool.query(`
                UPDATE usuarios
                SET session_id = NULL
                WHERE id = $1
            `,
            [sessionId]
        )
    } catch (error) {
        console.log(error)
    }
}