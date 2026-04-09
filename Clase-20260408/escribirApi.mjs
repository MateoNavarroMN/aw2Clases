//Leer un API y guardar los datos

import fsp from 'node:fs/promises'
import path from 'node:path'

try {
    //Hacer una peticion FETCH -> con promesas
    const respuesta = await fetch('https://69c566eb8a5b6e2dec2c62d6.mockapi.io/api/v1/productos')
    //Extraemos del cuerpo de la peticion los datos usando "response"
    const productos = await respuesta.json() // <--- Transforma el cuerpo "cadenas de texto" a un objeto/arreglo de JS
    
    //Creamos la ruta
    // const ruta = path.join('.', 'api.txt')
    // const ruta = path.join('./api.txt')
    const ruta = path.join('./api.json')
    //Guardar los datos en un archivo
    const contenido = JSON.stringify(productos, null, 4)
    await fsp.writeFile(ruta, contenido)
    
    //Van a leer el contenido del archivo api.json
    //Imprimir por consola
    
    // console.log(productos)
} catch (e) {
    console.log(e)
}   