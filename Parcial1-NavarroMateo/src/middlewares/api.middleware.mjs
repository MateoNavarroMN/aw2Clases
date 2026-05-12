// Middleware para validar parámetros de ruta.
// Garantiza que el ID recibido sea un número entero para evitar 
// procesamiento de I/O innecesario en el controlador.

export function validarIdNumerico(req, res, next) {
    const id = Number(req.params.id);

    // Si falla el casteo a número, se corta el flujo retornando HTTP 400 (Bad Request)
    if (isNaN(id)) {
        return res.status(400).json({ 
            error: "Petición malformada", 
            mensaje: "El parámetro 'id' debe ser un valor numérico entero." 
        });
    }

    // Flujo normal: se cede el control al siguiente middleware o ruta correspondiente
    next();
}