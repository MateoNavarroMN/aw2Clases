import path from 'node:path'
import http from 'node:http'
import { obtenerUsuariosApi } from './mjs/api.mjs'
import { guardarArchivoJSON, leerArchivoJSON } from './mjs/funciones.mjs'

// Creamos el servidor
const app = http.createServer(async (peticion, respuesta) => {

    if (peticion.method === 'GET') {

        // RUTA 1: /usuarios
        if (peticion.url === '/usuarios') {
            
            try {
                // Estado de peticion
                respuesta.statusCode = 200

                // Fetch a API externa
                const datosApi = await obtenerUsuariosApi()
                
                // Escribir datos en un .json
                const ruta = path.join('./usuarios.json')
                await guardarArchivoJSON(ruta, datosApi)

                // Leer datos desde el .json y enviar los datos al cliente
                const datosLeidos = await leerArchivoJSON(ruta)
                respuesta.setHeader('Content-Type', 'application/json; charset=utf-8')
                return respuesta.end(JSON.stringify(datosLeidos, null, 8))

            } catch (error) {
                respuesta.statusCode = 500
                return respuesta.end(`Error: ${error}`)
            }
        }

        // RUTA 1: /usuarios/filtrados
        if (peticion.url === '/usuarios/filtrados') {
            try {
                // Estado de peticion
                respuesta.statusCode = 200

                // Leer datos del json de /usuarios, filtrarlos y enviarlos al cliente
                const ruta = path.join('./usuarios.json')
                const usuarios = await leerArchivoJSON(ruta)
                const datosFiltrados = usuarios.filter((user) => {
                    return user.id < 10
                })
                respuesta.setHeader('Content-Type', 'application/json; charset=utf-8')
                return respuesta.end(JSON.stringify(datosFiltrados, null, 8))

            } catch (error) { // Gestión de errores
                respuesta.statusCode = 500
                return respuesta.end(`Error: ${error}`)
            }
        }
    }

    // Fallback
    respuesta.statusCode = 404
    respuesta.end('Recurso no encontrado')

})

// Arrancamos el servidor
app.listen(3000, () => {
    console.log('servidor corriendo en http://localhost:3000')
})
