import * as modeloAuth from './modelo.auth.mjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Gestiona el flujo de login validando credenciales y emitiendo tokens
export async function login(req, res) {
    const { usuario, pass } = req.body

    try {
        // Consulta asíncrona al modelo
        const usuarioBD = await modeloAuth.obtenerUsuarioPorNombre(usuario)
        
        // Manejo de inexistencia para no dar pistas a posibles atacantes (fuerza bruta/enumeración)
        if (!usuarioBD) {
            
            return res.status(401).json({ mensaje: 'Credenciales invalidas' })
        }

        // Comprobación criptográfica (Hashing)
        // bcrypt.compare evalúa el texto plano contra el hash almacenado utilizando el mismo "salt" interno.
        // Nunca se comparan textos planos ni se desencripta el hash (es una función matemática de un solo sentido).
        const passwordValida = await bcrypt.compare(pass, usuarioBD.password_hash)
        
        if (!passwordValida) {
            
            return res.status(401).json({ mensaje: 'Credenciales invalidas' })
        }
        
        // Creación del Payload
        // Se incluyen identificadores no sensibles para que el cliente o los middlewares puedan consumirlos.
        const datosPayload = {
            usuario: usuarioBD.username,
            rol: 0
        }

        // Emisión y firma del JWT
        // Se firma digitalmente para garantizar integridad.
        jwt.sign(datosPayload, process.env.FIRMA_JWT, { expiresIn: '1h' }, async (error, token) => {

            if (error) {
                console.log(error)
                return res.status(500).json({ mensaje: 'Error al generar el token' })
            }

            // Integración de JWT con gestión de estado (Stateful): Guardamos el token como identificador de sesión
            await modeloAuth.guardarSessionId(usuarioBD.id, token)

            // Envío de Cookie configurada bajo estándares de seguridad web
            res.cookie('token', token, {
                sameSite: 'lax',
                httpOnly: true,
                // secure: true, // <-- true al usar HTTPS
                signed: true
            })

            // Redirección al recurso protegido
            return res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }
}

// Invalida las credenciales activas del usuario
export async function cerrarSesion(req, res) {
    // Lectura de cookie firmada
    const token = req.signedCookies['token']

    if (token) {
        // Invalida la sesión en la base de datos
        await modeloAuth.eliminarSessionId(token)
    }

    // Eliminación de la cookie a del navegador
    res.clearCookie('token')
    res.redirect('login')
}
