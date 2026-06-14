import { Router } from 'express'
import * as controladorProcesos from './controlador.procesos.mjs'

const rutasProcesos = new Router()

// Endpoint diseñado por fuera de las convenciones REST para ejecutar procesos específicos sobre los datos
rutasProcesos.get('/calcular-precio-total/:tipo', controladorProcesos.calcularPrecioTotalPorTipo)

export default rutasProcesos