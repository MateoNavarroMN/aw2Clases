import express from 'express'

const PUERTO = 4321

const app = express()

app.get('/usuario', (req, res)=>{
    const usuario = {
        codigo: 5183
    } 
    res.json(usuario)
})

app.listen(PUERTO);