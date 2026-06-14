import jwt from 'jsonwebtoken'
import * as modeloAuth from '../auth/modelo.auth.mjs'


// Intercepta la petición HTTP antes de llegar al controlador final
export function validarIdNumerico(req, res, next) {
    const id = Number(req.params.id)

    // isNaN evalúa si el casteo a tipo Number resulta en Not-a-Number (NaN)
    const validacion = !isNaN(id)

    // Código 400 (Bad Request): El servidor no procesará la solicitud por un error del cliente
    if (!validacion) {
        return res.status(400).json({ mensaje: "Petición malformada, el parámetro 'id' debe ser un valor numérico entero." })
    }

    // Función de callback que cede el control al siguiente eslabón del ciclo de vida HTTP
    next()
}

// Intercepta las solicitudes antes de llegar a los controladores de negocio para asegurar la autorización.
export async function comprobarToken(req, res, next) {
    // Extracción del token desde la cookie previamente firmada y enviada por el cliente
    const token = req.signedCookies['token']

    if (!token) {
        // Retorno anticipado si no hay credenciales
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('calcular-')) {
            return res.status(401).json({ mensaje: 'Acceso denegado. Token no encontrado' })
        }
        // Fallback visual para peticiones de navegación
        return res.redirect('/login')
    }

    // Verificación criptográfica del JWT
    // Se valida la integridad matemática del token y su vigencia (fecha de expiración)
    jwt.verify(token, process.env.FIRMA_JWT, async (error, payload) => {
        // Si el token no es válido o expiró
        if (error) {
            res.clearCookie('token')
            if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('calcular-')) {
                return res.status(401).json({ mensaje: 'Token invalido o expirado' })
            }
            return res.redirect('/login')
        }

        // Verificación de Estado (Autorización en Base de Datos)
        // Convierte el JWT stateless en un mecanismo stateful consultando la persistencia de la sesión.
        const sesionActiva = await modeloAuth.obtenerUsuarioPorSessionId(token)

        if (!sesionActiva) {
            // El token es matemáticamente válido, pero la sesión fue revocada (ej: logout previo o baneo)
            res.clearCookie('token')
            if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/calcular-')) {
                return res.status(401).json({ mensaje: 'La sesión fue cerrada' })
            }
            return res.redirect('/login')
        }

        // Inyección del payload en el objeto Request
        // Permite a los controladores subsecuentes acceder a los datos del usuario autenticado
        req.usuario = payload

        // Cede el control al siguiente controlador/middleware en la pila de Express
        next()
    })
}