import * as modelo from "./modelo.midlewares.mjs"

// Middleware de enrutador: Intercepta la petición HTTP antes de llegar al controlador final
export function validarIdNumerico(req, res, next) {
    const id = Number(req.params.id)

    const validacion = modelo.validarIdNumerico(id)

    // Código 400 (Bad Request): El servidor no procesará la solicitud por un error del cliente
    if (!validacion) {
        return res.status(400).json({ mensaje: "Petición malformada, el parámetro 'id' debe ser un valor numérico entero." })
    }

    // Función de callback que cede el control al siguiente eslabón (controlador)
    next()
}