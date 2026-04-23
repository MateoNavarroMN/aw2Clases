import express from 'express'

const PUERTO = 3000

const productos = [
    {
        id: 1,
        nombre: "Remera",
        precio: 20000
    },
    {
        id: 2,
        nombre: "Pantalon",
        precio: 30000
    }
]


const app = express()

// Avisar a express que verifique si hay datos del cliente 
app.use(express.json())


const peticionGetEnRaiz = (req, res) => {
    res.set('content-type', 'text/html')
    res
        .status(200)
        .end('<h1>Hola</h1>')
}

app.get('/', peticionGetEnRaiz)

app.get('/productos', (req, res) => {
    res.json(productos) // Manda la cabecera, y el end
})

// Concepto parametros de ruta => el nombre de "id" se elije
app.get('/productos/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    //Filtrar
    const arregloFiltrado = productos.filter((producto)=>{
        return producto.id === parseInt(id)
    })
    res.json(arregloFiltrado) // Manda la cabecera, y el end
})

app.post('/', (req, res) => {
    res.set('content-type', 'application/json')
    res.end('{ "mensaje": "aw2"}')
})

app.post('/productos', (req, res) => {
    // Agrega al objeto req o peticion una propiedad llamada "body"
    const producto = req.body

    productos.push(producto)
    res
        .status(201)
        .json({mensaje: 'Producto agregado'})
})

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})









// ----- Repaso Callback

// const x = ()=>{
//     console.log('Hola')
// }

// const z = (cb)=>{
//     console.log('1')
//     cb()
//     console.log('2')
// }

// z(x)