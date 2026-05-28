# Base de datos — Tienda de ropa ecommerce
## Referencia de programación

---

## Visión general

El sistema se divide en **cinco dominios** funcionales:

| Dominio | Tablas |
|---|---|
| Usuarios y roles | `roles`, `usuarios`, `clientes` |
| Catálogo | `categorias`, `productos`, `variantes`, `talles`, `colores`, `producto_imagenes` |
| Compras | `pedidos`, `estados_pedido`, `detalles_pedido` |
| Pagos | `pagos`, `metodos_pago` |
| Extras | `carrito_compra`, `newsletter_suscriptores` |

---

## Dominio 1 — Usuarios y roles

### `roles`

Define los tipos de cuenta que puede tener un usuario registrado.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Ej: `admin`, `cliente` |
| `descripcion` | TEXT | Para qué sirve ese rol |

**Seedeo inicial:**
```sql
INSERT INTO roles (nombre, descripcion) VALUES
  ('admin',   'Acceso total al panel de administración'),
  ('cliente', 'Usuario comprador registrado');
```

---

### `usuarios`

Personas que se crearon una cuenta en la tienda.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Nombre visible |
| `email` | VARCHAR UNIQUE | Email de login |
| `password_hash` | VARCHAR | Contraseña hasheada (bcrypt o argon2, nunca texto plano) |
| `fecha_registro` | TIMESTAMP | Cuándo se registró |
| `rol_id` | INT FK → `roles.id` | Tipo de usuario |
| `activo` | BOOL | Para suspender cuentas sin borrarlas |

**Reglas de negocio:**
- El `email` debe ser único en toda la tabla.
- Para desactivar un usuario usar `activo = false`, nunca borrarlo. Esto preserva el historial de pedidos y el vínculo con `clientes`.

---

### `clientes`

Guarda los datos de la persona que realizó un pedido. **No es lo mismo que `usuarios`.** Un cliente puede existir sin tener cuenta registrada (guest checkout).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre_completo` | VARCHAR | Nombre ingresado en el checkout |
| `email` | VARCHAR | Email ingresado en el checkout |
| `telefono` | VARCHAR | Teléfono de contacto |
| `calle` | VARCHAR | Dirección de envío — calle y número |
| `ciudad` | VARCHAR | Ciudad |
| `provincia` | VARCHAR | Provincia / estado |
| `codigo_postal` | VARCHAR | CP |
| `fecha` | TIMESTAMP | Cuándo se creó el registro |
| `usuario_id` | INT FK nullable → `usuarios.id` | Vínculo con cuenta registrada. NULL si es invitado |

**Reglas de negocio:**
- Se crea un registro en `clientes` en **cada checkout**, sin importar si el comprador tiene cuenta o no.
- Al guardar, se busca si el `email` ya existe en `usuarios`. Si existe → se completa `usuario_id`. Si no → queda `NULL`.
- Si el invitado luego se registra, se puede hacer una migración que llene los `usuario_id` donde el email coincida.

**Flujo en código:**
```js
async function crearCliente(datosCheckout) {
  const usuario = await db.usuarios.findOne({ email: datosCheckout.email });
  return await db.clientes.create({
    ...datosCheckout,
    usuario_id: usuario?.id ?? null,
  });
}
```

---

## Dominio 2 — Catálogo

### `categorias`

Agrupa los productos (Remeras, Pantalones, Camperas, etc.).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Nombre visible |
| `descripcion` | TEXT | Descripción opcional |

**Regla de negocio:** Un producto solo puede pertenecer a **una** categoría.

---

### `productos`

El producto base, sin tener en cuenta talle ni color. Contiene la info general.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Nombre del producto |
| `descripcion` | TEXT | Descripción larga |
| `precio` | DECIMAL(10,2) | Precio base |
| `categoria_id` | INT FK → `categorias.id` | A qué categoría pertenece |
| `destacado` | BOOL | Para mostrar en home o secciones especiales |
| `fecha_creacion` | TIMESTAMP | Cuándo se cargó |
| `activo` | BOOL | Para ocultar sin borrar |

**Reglas de negocio:**
- El `precio` es el precio base del producto.
- Para desactivar un producto usar `activo = false`. Nunca borrar si ya tiene pedidos asociados.

---

### `talles`

Catálogo de talles disponibles.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Ej: `XS`, `S`, `M`, `L`, `XL`, `XXL` |
| `orden` | INT | Para mostrarlos en la secuencia correcta |

**Regla de negocio:** El campo `orden` es clave. Sin él los talles aparecen alfabéticamente (`L`, `M`, `S`, `XL`, `XS`). Seedear siempre con el orden correcto.

**Seedeo inicial:**
```sql
INSERT INTO talles (nombre, orden) VALUES
  ('XS', 1), ('S', 2), ('M', 3),
  ('L', 4), ('XL', 5), ('XXL', 6);
```

---

### `colores`

Catálogo de colores disponibles.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Ej: `Negro`, `Blanco`, `Rojo` |

---

### `variantes`

**La tabla más importante del catálogo.** Cada fila representa una combinación única de producto + talle + color. Es lo que el cliente realmente agrega al carrito y compra.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `producto_id` | INT FK → `productos.id` | A qué producto pertenece |
| `talle_id` | INT FK → `talles.id` | Qué talle es |
| `color_id` | INT FK → `colores.id` | Qué color es |
| `activo` | BOOL | Para ocultar sin borrar |
| `stock` | INT | Unidades disponibles |

**Reglas de negocio:**
- La combinación `(producto_id, talle_id, color_id)` debe ser UNIQUE. No puede haber dos variantes del mismo producto con el mismo talle y color.
- El `stock` se descuenta cuando se **confirma un pedido**, no cuando se agrega al carrito.
- Si `stock = 0`, mostrar como "sin stock" pero no borrar la variante.

**Índice recomendado:**
```sql
UNIQUE INDEX idx_variante_unica (producto_id, talle_id, color_id);
```

---

### `producto_imagenes`

Imágenes de cada producto.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `producto_id` | INT FK → `productos.id` | A qué producto pertenece |
| `url` | VARCHAR | URL de la imagen (CDN o storage) |
| `orden` | INT | Posición dentro de la galería. Empieza en 1 |

**Regla de negocio:** El `orden` determina el orden de la galería. La primera imagen (orden = 1) se usa como portada del producto en los listados.

---

## Dominio 3 — Compras

### `estados_pedido`

Catálogo de estados por los que puede pasar un pedido.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Nombre del estado |
| `orden` | INT | Orden cronológico del flujo |

**Seedeo inicial:**
```sql
INSERT INTO estados_pedido (nombre, orden) VALUES
  ('Pendiente de pago', 1),
  ('Pago confirmado',   2),
  ('En preparación',    3),
  ('Enviado',           4),
  ('Entregado',         5),
  ('Cancelado',         6);
```

---

### `pedidos`

Representa una compra confirmada. Se crea cuando el cliente finaliza el checkout.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `cliente_id` | INT FK → `clientes.id` | Quién compró |
| `total` | DECIMAL(10,2) | Total final del pedido |
| `estado_pedido_id` | INT FK → `estados_pedido.id` | Estado actual |
| `descuento` | DECIMAL(10,2) | Descuento aplicado. `0` si ninguno |
| `notas` | TEXT | Notas del cliente al hacer el pedido |
| `fecha_pedido` | TIMESTAMP | Cuándo se realizó |

**Reglas de negocio:**
- El `total` se calcula sumando `precio_unitario × cantidad` de todos los `detalles_pedido` y restando `descuento`. Se guarda fijo para que cambios de precio futuros no afecten el historial.
- El estado inicial al crear un pedido es siempre `Pendiente de pago` (id = 1).
- La dirección de envío se obtiene del `cliente_id` relacionado.

---

### `detalles_pedido`

Los ítems específicos que compró el cliente dentro de un pedido.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `pedido_id` | INT FK → `pedidos.id` | A qué pedido pertenece |
| `variante_id` | INT FK → `variantes.id` | Qué variante se compró |
| `cantidad` | INT | Cuántas unidades |
| `precio_unitario` | DECIMAL(10,2) | Precio capturado al momento de la compra |

**Regla más importante:** El `precio_unitario` se copia desde `productos.precio` en el momento del checkout y se guarda aquí. Nunca se lee en tiempo real. Esto garantiza que si el precio cambia después, los pedidos históricos conservan el precio original.

**Al confirmar un pedido:**
```js
async function confirmarPedido(carritoItems, pedidoId) {
  for (const item of carritoItems) {
    const variante = await db.variantes.findById(item.variante_id);
    const producto = await db.productos.findById(variante.producto_id);

    await db.detalles_pedido.create({
      pedido_id:       pedidoId,
      variante_id:     item.variante_id,
      cantidad:        item.cantidad,
      precio_unitario: producto.precio, // precio capturado ahora
    });

    // Descontar stock
    await db.variantes.decrement('stock', {
      by: item.cantidad,
      where: { id: item.variante_id },
    });
  }
}
```

---

## Dominio 4 — Pagos

### `metodos_pago`

Catálogo de formas de pago habilitadas en la tienda.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `nombre` | VARCHAR | Nombre visible para el cliente |
| `activo` | BOOL | Para habilitar/deshabilitar sin borrar |

**Seedeo inicial:**
```sql
INSERT INTO metodos_pago (nombre, activo) VALUES
  ('Pago en efectivo al recibir', true),
  ('Transferencia bancaria',       true),
  ('MercadoPago',                  true);
```

> **Nota de implementación:** En la lógica de negocio, identificar el método por su `id` (no por `nombre`, ya que puede editarse). Conviene dejar documentado qué `id` corresponde a cada método, o agregar un campo `codigo` en el futuro si se necesita más flexibilidad.

---

### `pagos`

Registra el intento de pago de un pedido.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `pedido_id` | INT FK → `pedidos.id` | A qué pedido corresponde |
| `metodo_pago_id` | INT FK → `metodos_pago.id` | Qué método usó |
| `estado_pago` | VARCHAR | `pendiente`, `aprobado`, `rechazado`, `vencido` |
| `monto` | DECIMAL(10,2) | Cuánto se pagó |
| `comprobante_url` | VARCHAR nullable | URL del comprobante subido. Solo transferencia |
| `mp_preference_id` | VARCHAR nullable | ID de preferencia de MercadoPago |
| `mp_payment_id` | VARCHAR nullable | ID del pago confirmado por MercadoPago |
| `fecha_pago` | TIMESTAMP | Cuándo se registró |

**Reglas por método de pago:**

| Método | Campos que se usan | Flujo |
|---|---|---|
| Efectivo | Solo `estado_pago` | El admin confirma manualmente cuando el repartidor cobra |
| Transferencia | `comprobante_url` | El cliente sube foto del comprobante; el admin valida y aprueba |
| MercadoPago | `mp_preference_id`, `mp_payment_id` | Se crea una preference; MP confirma via webhook |

**Flujo MercadoPago:**
```js
// 1. Al crear el pedido, generar preference
const preference = await mp.preferences.create({
  items: detalles.map(d => ({ ... })),
  back_urls: { success: '/pago/ok', failure: '/pago/error' },
});

await db.pagos.create({
  pedido_id:        pedido.id,
  metodo_pago_id:   3, // id de MercadoPago
  estado_pago:      'pendiente',
  monto:            pedido.total,
  mp_preference_id: preference.id,
});

// 2. Webhook de MercadoPago actualiza el pago
async function handleWebhook(notification) {
  const mpPago = await mp.payment.findById(notification.data.id);
  await db.pagos.update({
    estado_pago:   mpPago.status,
    mp_payment_id: mpPago.id.toString(),
  }, { where: { mp_preference_id: mpPago.preference_id } });

  if (mpPago.status === 'approved') {
    await actualizarEstadoPedido(pedidoId, 'Pago confirmado');
  }
}
```

> **Importante:** Siempre usar el webhook para confirmar pagos de MercadoPago, no las `back_urls`. Si el usuario cierra el browser luego de pagar, las `back_urls` no se ejecutan y el pedido quedaría en pendiente para siempre.

---

## Dominio 5 — Extras

### `carrito_compra`

Tabla de staging donde el visitante va agregando productos antes de confirmar. **No es un pedido.** Se vacía cuando el pedido se confirma.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `usuario_id` | INT FK nullable → `usuarios.id` | Si está logueado |
| `variante_id` | INT FK → `variantes.id` | Qué variante agregó |
| `cantidad` | INT | Cuántas unidades |
| `sesion_id` | VARCHAR nullable | Para visitantes sin cuenta |

**Reglas de negocio:**
- Un visitante sin cuenta se identifica por `sesion_id` (UUID generado al entrar al sitio, guardado en cookie o localStorage).
- Si el visitante se loguea durante la sesión, migrar los ítems del carrito de `sesion_id` a `usuario_id`:
```sql
UPDATE carrito_compra
SET usuario_id = :userId, sesion_id = NULL
WHERE sesion_id = :sesionId;
```
- Al confirmar el pedido, borrar todos los registros del carrito de ese usuario/sesión.
- El carrito **no reserva stock**. El stock se descuenta solo al confirmar el pedido. Si otro cliente compró primero y se agotó, se informa al siguiente al intentar confirmar.
- Siempre debe tener `usuario_id` O `sesion_id`. Nunca ambos NULL al mismo tiempo.

---

### `newsletter_suscriptores`

Cualquier persona, registrada o no, puede suscribirse. Es independiente del sistema de compras.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT PK | Identificador |
| `email` | VARCHAR UNIQUE | Email del suscriptor |
| `activo` | BOOL | Para manejar bajas sin borrar el registro |
| `fecha_suscripcion` | TIMESTAMP | Cuándo se suscribió |
| `usuario_id` | INT FK nullable → `usuarios.id` | Si tiene cuenta, se vincula |

**Reglas de negocio:**
- El `email` es único. Si alguien intenta suscribirse dos veces con el mismo email, solo se reactiva (`activo = true`).
- Al dar de baja, poner `activo = false`. No borrar el registro.
- Si existe un usuario registrado con el mismo email, vincular por `usuario_id`.

**Upsert recomendado:**
```sql
INSERT INTO newsletter_suscriptores (email, usuario_id, activo, fecha_suscripcion)
VALUES (:email, :usuarioId, true, NOW())
ON DUPLICATE KEY UPDATE activo = true;
```

---

## Resumen de relaciones

```
roles ──────────────── usuarios
                           │
                           │ (mismo email → vincula)
                           ▼
                       clientes ──────────── pedidos ──── estados_pedido
                                                 │
                                        ┌────────┴──────────┐
                                        ▼                    ▼
                                detalles_pedido            pagos
                                        │                    │
                                        ▼                    ▼
                                    variantes          metodos_pago
                                   /    |    \
                            producto  talle  color
                               │
                        producto_imagenes

usuarios ──────────── carrito_compra ──── variantes
     │
     └─────────── newsletter_suscriptores
```

---

## Checklist antes de programar

- [ ] Seedear primero: `roles`, `estados_pedido`, `metodos_pago`, `talles`, `colores`
- [ ] `precio_unitario` en `detalles_pedido` siempre se copia al momento del checkout, nunca se lee en tiempo real
- [ ] El stock se descuenta en `variantes.stock` solo al confirmar el pedido, no al agregar al carrito
- [ ] `usuario_id` en `clientes` puede ser NULL (guest checkout válido)
- [ ] `usuario_id` en `carrito_compra` puede ser NULL (visitante sin cuenta usa `sesion_id`)
- [ ] Nunca borrar: productos, variantes, usuarios, pedidos → usar `activo = false`
- [ ] En MercadoPago, usar siempre el webhook para confirmar, no las `back_urls`
- [ ] El campo `orden` en `talles` define la secuencia correcta de visualización
- [ ] La primera imagen por `orden` en `producto_imagenes` actúa como portada del producto
