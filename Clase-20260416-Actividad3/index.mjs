import fps from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import { readFile } from 'node:fs'

// Link de la actividad https://docs.google.com/document/d/1JKUC4az6lXXRl8abe_YbcFQC9RM1L17xgqaKIefSkfs/edit?tab=t.0
// Configurar la ruta /usuarios con el verbo GET
// hacer un fetch a la API REST externa
// guardar los datos en un archivo del tipo .json
// leer el archivo y enviar los datos al cliente
// Para rutas que no sean /usuarios mostrar status 404 y  'Recurso no encontrado'

// Falta hacer el punto 5
// 5. Extra refactorización: Crear funciones con tareas específicas y modularizar.

const app = http.createServer(async (peticion, respuesta) => {

    if (peticion.method === 'GET') {
        if (peticion.url === '/usuarios') {
            respuesta.statusCode = 200
            const respuestaApi = await fetch('https://api.escuelajs.co/api/v1/users')
            const datosApi = await respuestaApi.json()
            try {
                const ruta = path.join('./usuarios.json')
                const contenido = JSON.stringify(datosApi, null, 8)
                await fps.writeFile(ruta, contenido)
            } catch (error) {
                respuesta.statusCode = 500
                return respuesta.end('error al escribir los datos')
            }

            try {
                const datosLeidos = await fps.readFile('./usuarios.json')
                return respuesta.end(datosLeidos)
            } catch (error) {
                respuesta.statusCode = 500
                return respuesta.end('error al leer los datos')
            }
        }

        if (peticion.url === '/usuarios/filtrados') {
            respuesta.statusCode = 200
            let datosFiltrados
            try {
                const datosLeidos = await fps.readFile('./usuarios.json', 'utf-8')
                const usuarios = JSON.parse(datosLeidos)
                datosFiltrados = usuarios.filter((user) => {
                    return user.id < 10
                })
            } catch (error) {
                return respuesta.end('Error al filtrar datos')
            }

            try {
                const ruta = path.join('./usuariosFiltrados.json')
                const contenido = JSON.stringify(datosFiltrados, null, 8)
                await fps.writeFile(ruta, contenido)
            } catch (error) {
                respuesta.statusCode = 500
                return respuesta.end('error al escribir los datos')
            }

            try {
                const datosLeidos = await fps.readFile('./usuariosFiltrados.json')
                return respuesta.end(datosLeidos)
            } catch (error) {
                respuesta.statusCode = 500
                return respuesta.end('error al leer los datos')
            }
        }
    }

    // Fallback
    respuesta.statusCode = 404
    respuesta.end('Recurso no encontrado')

})

app.listen(3000, () => {
    console.log('servidor corriendo en http://localhost:3000')
})
