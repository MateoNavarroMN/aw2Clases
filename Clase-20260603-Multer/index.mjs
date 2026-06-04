import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { MimeType } from 'mime-types'

const mime = MimeType()

const PUERTO = 3000

const app = express()

// Ejecutamos multer
const almacenamiento = multer.diskStorage({
  // Destino de almacenamiento
    destination: function (req, file, cb) {
    // Chequeos

    cb(null, './archivos')
  },
  // Gestion del nombre
  filename: function (req, file, cb) {
    // Obtengo la extension desde el mime type
    const extension = mime.extension(file.mimetypes)
    // Creo el nombre del archivo con un identificador unico con nanoid()
    const nombreImagen = nanoid() + '.' + extension // Genera un UID
    cb(null, nombreImagen)
  }
})

const subirArchivo = multer({
    storage: almacenamiento
})

const gestionArchivo = subirArchivo.single('imagen') // <-- devuelve una funcion

app.use('/admin', express.static('./panelAdmin'))
app.use('/archivos', express.static('./archivos')) // Hacemos publica la carpeta archivos

app.post('/subir-archivo', (req, res)=>{
    // Verificamos el proceso desubida
    gestionArchivo(req, res, (error)=>{
        // Si hay error respondemos
        console.log(error)
        if(error) return res.status(500).json({ mensaje: 'Error en el servidor' })
        
        // Si no hay error
        // req.body <--- app.use(express.json())
        console.log(req.file)
        res.json({ mensaje: 'Archivo subido' })
        
    })
})

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})