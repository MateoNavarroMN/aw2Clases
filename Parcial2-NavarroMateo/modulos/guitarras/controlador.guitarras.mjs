import * as modelo from "./modelo.guitarras.mjs"

// Capa de Controlador: Interfaz entre el protocolo HTTP y la lógica de negocio
export async function obtenerGuitarras(req, res){
    try {
        // Invocación asíncrona al modelo para la obtención de la persistencia
        const guitarras = await modelo.obtenerGuitarras()
        // Respuesta exitosa con estado HTTP 200 (OK)
        res.status(200).json(guitarras)
    } catch (error) {
        // Gestión de excepciones de servidor (HTTP 500 Internal Server Error)
        res.status(500).json({ mensaje: "Error en la recuperación de la colección" })
    }
}

export async function obtenerGuitarraId(req, res){
    const idBuscado = Number(req.params.id)

    try {
        const guitarraFiltrada = await modelo.obtenerGuitarraId(idBuscado)

        // Verificación de existencia del recurso para cumplimiento de estándares REST
        if (guitarraFiltrada.length <= 0) {
            return res.status(404).json({ mensaje: "Recurso no localizado" })
        }
        
        res.status(200).json(guitarraFiltrada) 
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el procesamiento de la solicitud" })
    }
}