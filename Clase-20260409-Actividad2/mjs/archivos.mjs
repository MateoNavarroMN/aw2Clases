import fsp from 'node:fs/promises';
import path from 'node:path';

const ruta = path.join('./usuarios.json');

export async function escribirArchivo(users) {
    // Escribo el JSON formateado en un archivo
    const ruta = path.join('./usuarios.json')
    const contenido = JSON.stringify(users, null, 3)
    await fsp.writeFile(ruta, contenido)
    console.log("Archivo guardado correctamente.");
}

export async function leerArchivo() {
    const contenidoArchivo = await fsp.readFile('./usuarios.json', 'utf-8')
    const datosLeidos = JSON.parse(contenidoArchivo)
    console.table(datosLeidos)
}