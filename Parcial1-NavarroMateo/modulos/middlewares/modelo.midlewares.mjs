// Capa de modelo para encapsular la lógica de validación abstracta
export function validarIdNumerico(id) {
    // isNaN evalúa si el casteo a tipo Number resulta en Not-a-Number (NaN)
    return !isNaN(id)
}