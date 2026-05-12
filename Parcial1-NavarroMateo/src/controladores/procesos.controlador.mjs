import fps from 'node:fs/promises'
import path from 'node:path'

const ruta = path.join('./src/datos/guitarras.json')


// Controlador Procedural (No REST).
// Recibe un parámetro, procesa los datos aplicando filtros, 
// y retorna un resultado.

export async function calcularPrecioTotalPorTipo(req, res) {
    const tipoBuscado = req.params.tipo.toLowerCase()

    try {
        const datosLeidos = await fps.readFile(ruta, 'utf-8')
        const guitarras = JSON.parse(datosLeidos)

        // Filtro con loweCase para normalizar el criterio de búsqueda
        const guitarrasFiltradas = guitarras.filter((guitarra) => {
            return tipoBuscado === guitarra.tipo.toLowerCase()
        })

        // Corte temprano si la variable no tiene elementos
        if (guitarrasFiltradas.length === 0) {
            return res.status(404).json({ mensaje: `No se encontraron guitarras del tipo: '${tipoBuscado}'` })
        }

        let precioTotalTipo = 0

        // Recorrido para acumular la sumatoria de la propiedad 'precio'
        guitarrasFiltradas.forEach((guitarra) => {
            precioTotalTipo += Number(guitarra.precio)
        })

        // Retorno de estructura armada (payload no estándar) con HTTP 200
        res.status(200).json({
            tipo_consultado: tipoBuscado,
            cantidad_guitarras: guitarrasFiltradas.length,
            valor_total_tipo_usd: precioTotalTipo
        })

    } catch (error) {
        console.log("Error en el procesamiento de datos:", error)
        res.status(500).json({ error: "Error interno del servidor al procesar los datos" })
    }
}