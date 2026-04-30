import express from 'express'

const PUERTO = 3000
const API_URL = 'http://localhost:4321/usuario'

const app = express()

async function validarCodigo(req, res, next) {
    try {
        const codigoIngresado = Number(req.params.codigo)
        const respuestaApi = await fetch(API_URL)
        const datosApi = await respuestaApi.json()
        const codigoApi = Number(datosApi.codigo)
    } catch (error) {
        console.log(error)
    }

    if (codigoIngresado === codigoApi) {
        console.log('codigo verificado')
        next()
    } else {
        console.log('codigo no verificado')
        res.status(400)
        res.json({ mensaje: "El código es incorrecto" });
    }
}

app.get('/:codigo', validarCodigo, (req, res) => {
    res.status(200)
    res.json({ mensaje: "El código es correcto" })
})

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})