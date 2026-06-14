import { Router } from 'express'
import * as controladorAuth from './controlador.auth.mjs'

const rutasLogin = new Router()

rutasLogin.post('/api/v1/autenticacion', controladorAuth.login)
rutasLogin.get('/cerrar-sesion', controladorAuth.cerrarSesion)

export default rutasLogin