import express from 'express'

const PUERTO = 3000

const app = express()

//Middlewares

function middleware1(req, res, next) {
    console.log('middleware1')
    next() // <-- seguir la pila de ejecucion
}

function middleware2(req, res, next) {
    console.log('middleware2')

    const existeUsuario = true
    if(existeUsuario){
        console.log('usuario existe --> pasa')
        return next()
    }

    console.log('usuario no existe --> no pasa')
    next() // <-- seguir la pila de ejecucion
}

app.get('/', middleware1, middleware2, (req, res) => {
    console.log('GET')
    res.send('Hola')
})

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
