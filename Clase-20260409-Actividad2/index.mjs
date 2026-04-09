// import fsp from 'node:fs/promises'
// import path from 'node:path'

// try {
//     //fetch()
//     const respuesta = await fetch('https://api.escuelajs.co/api/v1/users')
//     const users = await respuesta.json()

//     // formateo JSON con map() => id, email, name
//     const usersFormateado = users.map((usuarios) => {
//         return {
//             id: usuarios.id,
//             email: usuarios.email,
//             name: usuarios.name
//         }
//     })

//     // Escribo el JSON formateado en un archivo
//     const ruta = path.join('./usuarios.json')
//     const contenido = JSON.stringify(usersFormateado, null, 3)
//     await fsp.writeFile(ruta, contenido)

//     const contenidoArchivo = await fsp.readFile('./usuarios.json', 'utf-8')
//     const datosLeidos = JSON.parse(contenidoArchivo)
//     return datosLeidos;

// } catch (e) {
//     console.log(e)
// }

// 9) Refactorizado
import { obtenerUsuariosFormateados } from './mjs/api.mjs';
import { escribirArchivo, leerArchivo } from './mjs/archivos.mjs';

async function ejecutarApp() {
    try {
        const usuarios = await obtenerUsuariosFormateados();

        await escribirArchivo(usuarios);

        const resultadoFinal = await leerArchivo();
        
        console.table(resultadoFinal);

    } catch (e) {
        console.log(e);
    }
}

ejecutarApp();