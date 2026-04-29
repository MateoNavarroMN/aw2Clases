import express from 'express'

const PUERTO = 3000

const app = express()

//Middlewares

function middleware1(req, res, next) {
    console.log('middleware1')

    next() // <-- seguir la pila de ejecucion
}

app.use('/saludo', middleware1) // la ruta en el use se usa como prefijo, no como exacta

app.get('/', (req, res) => {
    console.log('GET')
    res.send('Hola')
})

app.get('/saludo', (req, res) => {
    console.log('GET Saludo')
    res.send('Hola ruta /saludo')
})

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
