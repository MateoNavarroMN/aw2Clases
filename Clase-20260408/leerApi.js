//Leer un API

try {
    //Hacer una peticion FETCH -> con promesas
    const respuesta = await fetch('https://69c566eb8a5b6e2dec2c62d6.mockapi.io/api/v1/productos')
    //Extraemos del cuerpo de la peticion los datos usando "response"
    const productos = await respuesta.json() // <--- Transforma el cuerpo "cadenas de texto" a un objeto/arreglo de JS
    console.log(productos)
} catch (e) {
    console.log(e)
}   