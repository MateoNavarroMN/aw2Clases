import * as modelo from './modelo.procesos.mjs'

// Controlador: Gestiona la petición HTTP (req) y delega la lógica de negocio al modelo.
export async function calcularPrecioTotalPorTipo(req, res) {
    const tipoBuscado = req.params.tipo.toLowerCase()

    try {
        // Se utiliza await para esperar la resolución de la Promesa (operación I/O asíncrona)
        const guitarrasFiltradas = await modelo.calcularPrecioTotalPorTipo(tipoBuscado)

        // Manejo de inexistencia de recursos devolviendo código HTTP 404 (Not Found)
        if (guitarrasFiltradas.length === 0) {
            return res.status(404).json({ mensaje: `No se encontraron guitarras del tipo: '${tipoBuscado}'` })
        }

        let precioTotalTipo = 0

        // Iteración para cálculo procedimental sobre el set de datos
        guitarrasFiltradas.forEach((guitarra) => {
            precioTotalTipo += Number(guitarra.precio)
        })

        // Retorno de respuesta exitosa (HTTP 200) siguiendo formato JSON para la API
        res.status(200).json({
            tipo_consultado: tipoBuscado,
            cantidad_guitarras: guitarrasFiltradas.length,
            valor_total_tipo_usd: precioTotalTipo
        })

    } catch (error) {
        // Código HTTP 500: Error interno del servidor para atajar excepciones no controladas
        res.status(500).json({ mensaje: "Error interno del servidor al procesar los datos" })
    }
}