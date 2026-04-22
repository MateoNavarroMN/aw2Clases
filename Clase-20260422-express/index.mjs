import express from 'express'

const PUERTO = 3023

//Instancia servidor express
const app = express()

app.get('/', (req, res)=>{ // req, res => datos de peticion
    res.set('content-type', 'text/html') // => Cabecera
    res
        .status(200) // => Codigo de estado
        .end('<h1>Hola con GET</h1>') // => Cuerpo(body) => Contenido
})

app.get('/materias', (req, res)=>{ // req, res => datos de peticion
    res.set('content-type', 'application/json') // => Cabecera
    res
        .status(200) // => Codigo de estado
        .end(`[
                { "materia": "materia 1"},
                { "materia": "materia 2"},
                { "materia": "materia 3"}
              ]`                                                                                              
            ) // => Cuerpo(body) => Contenido
})

app.get('/sopa', (req, res)=>{ // req, res => datos de peticion
    res
        .status(304)
        .end('Hola GEI')
})

app.get('/feli', (req, res)=>{ // req, res => datos de peticion
    res
        .status(304)
        .end('Hola Compremos el Iphone 18 pro max dark cherry')
})


// -----------


app.post('/', (req, res)=>{ // req, res => datos de peticion
    res.set('content-type', 'application/json')
    res.end('{ "mensaje": "hola", "nombre": "hola"}')
})

app.post('/sopa', (req, res)=>{ // req, res => datos de peticion
    res.end('Hola con POST sopa')
})

app.post('/feli', (req, res)=>{ // req, res => datos de peticion
    res.end('Hola con POST feli')
})

//abrir un puerto
app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
