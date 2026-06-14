import fps from 'node:fs/promises'
import path from 'node:path'

// process.cwd() obtiene el directorio actual de trabajo para evitar fallos por rutas relativas
const ruta = path.join(process.cwd(), 'datos', 'guitarras.json')

// Capa de Modelo: Encapsula el acceso directo a los datos y la lógica de filtrado
export async function obtenerGuitarras() {
    try {
        // Lectura asíncrona del File System para no bloquear el Event Loop de Node.js
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        return JSON.parse(datosLeidos)
    } catch (error) {
        console.log("Fallo en el acceso a los datos", error)
    }
}

export async function obtenerGuitarraId(idBuscado) {
    try {
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        const guitarras = JSON.parse(datosLeidos)

        // Aplicación de lógica de filtrado sobre el set de datos JSON
        return guitarras.filter((guitarra) => {
            return idBuscado === Number(guitarra.id)
        })
    } catch (error) {
        console.log("Error en la lectura por ID", error)
    }
}