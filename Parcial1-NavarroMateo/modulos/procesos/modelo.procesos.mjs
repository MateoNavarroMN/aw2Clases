import fps from 'node:fs/promises'
import path from 'node:path'

// process.cwd() obtiene el directorio actual de trabajo para evitar fallos por rutas relativas
const ruta = path.join(process.cwd(), 'datos', 'guitarras.json')

// Modelo: Capa encargada del acceso a los datos (persistencia).
export async function calcularPrecioTotalPorTipo(tipoBuscado) {
    try {
        // Lectura asíncrona del File System para no bloquear el Event Loop de Node.js
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        const guitarras = JSON.parse(datosLeidos)

        const guitarrasFiltradas = guitarras.filter((guitarra) => {
            return tipoBuscado === guitarra.tipo.toLowerCase()
        })

        return guitarrasFiltradas
    } catch (error) {
        console.log("Error en el procesamiento de datos:", error)
    }
}