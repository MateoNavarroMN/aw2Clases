import express from 'express'
import path from 'node:path'
const PUERTO = 3000

const app = express()

//Middlewares
// Levantamos una web estaticas
app.use(express.static(path.resolve('front')))

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
