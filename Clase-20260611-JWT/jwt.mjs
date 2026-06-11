import jwt from 'jsonwebtoken'

// sign -> firma
// verify -> verificar

const datosPayload = {
    usuario: 'hola',
    rol: 0
}

jwt.sign(datosPayload, 'frasesupersecreta', {expiresIn: '1h'}, (error, token)=>{
    if(error) return console.log(error)
        
    console.log(token)
})