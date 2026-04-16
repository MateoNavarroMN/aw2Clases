import fps from 'node:fs/promises';

export async function guardarArchivoJSON(ruta, datos) {
    try {
        // Escribir datos en un .json
        const contenido = JSON.stringify(datos, null, 8)
        await fps.writeFile(ruta, contenido)
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

export async function leerArchivoJSON(ruta) {
    try {
        // Leer datos desde el .json
        const datosLeidos = await fps.readFile(ruta)
        return JSON.parse(datosLeidos)
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}