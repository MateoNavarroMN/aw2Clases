import fps from 'node:fs/promises'
import path from 'node:path'

// Resolución de la ruta estática hacia la persistencia de datos local
const ruta = path.join('./src/datos/guitarras.json')

// Obtiene y retorna la colección completa de recursos
export async function obtenerGuitarras(req, res){
    try {
        // Lectura asíncrona y deserialización del JSON
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        const guitarras = JSON.parse(datosLeidos) 
        
        res.status(200).json(guitarras)
    } catch (error) {
        console.log("Error al conectar con la API:", error)
        res.status(500).json({ error: "Error interno del servidor al procesar los datos" })
    }
}

// Busca un recurso específico por su ID
export async function obtenerGuitarraId(req, res){
    const idBuscado = Number(req.params.id)

    try {
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        const guitarras = JSON.parse(datosLeidos) 
        
        // Retorna el primer elemento que cumpla con la condición estricta
        const guitarraFiltrada = guitarras.find((guitarra) => {
            return idBuscado === Number(guitarra.id)
        })
        
        // Manejo de inexistencia de datos (HTTP 404 Not Found)
        if (!guitarraFiltrada) {
            return res.status(404).json({ error: "Guitarra no encontrada" })
        }else{
            res.status(200).json(guitarraFiltrada) 
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor al procesar los datos" })
    }
}