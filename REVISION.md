# Revisión de SportLike — 14 de octubre de 2026

## Cambios realizados

- Inicio de sesión por correo y contraseña en cliente y servidor. Conserva el nombre de usuario para identificación del perfil; no es necesario cambiar la BD.
- Validación del correo, normalización, tiempo límite de conexión y bloqueo de envíos repetidos del formulario. Se mantienen verificación de cuenta, bloqueo por intentos fallidos, JWT y Google.
- Promociones pausadas mediante `src/config/features.js` y `server/helpers/features.js`. No se anuncian descuentos por cantidad ni se consulta ese módulo desde el sitio. Los accesos públicos se ocultan; la ruta antigua presenta categorías del catálogo, sin ofertas inventadas.
- En Inicio se sustituyó el acceso a promociones por Tiendas. En Registro se sustituyó la promesa de ofertas por consulta de pedidos.
- El panel muestra el módulo de promociones pausado, sin botones para publicar o enviar campañas. En el servidor, los accesos administrativos siguen autenticados y responden 503 mientras dure la pausa; el listado público responde vacío. No se crean tablas ni se envían correos durante la pausa.
- Administración: menú móvil y su fondo de cierre corregidos, botones accesibles, inicial de cuenta tolerante a nombres vacíos, cierre del menú de cuenta al navegar, ruta desconocida con retorno al resumen, encabezados en español y colores oscuros del contenedor compartido.
- Se eliminó el indicador verde decorativo del monitor: no representaba una comprobación real de conexión.
- El resumen administrativo muestra un error recuperable si falla parte de sus consultas, evitando presentar estadísticas incompletas como resultados correctos.

## Pendientes antes de publicar

1. **Compra sin envíos.** `src/pages/User/Carrito.js` y `server/routes/public/payments.routes.js` aún agregan $75 cuando el subtotal es menor a $1,500. El pago también exige una dirección. Definir y ajustar la recogida en tienda de extremo a extremo antes de vender; no basta con ocultar la palabra entrega. No se alteró el cálculo de pagos en esta revisión.
2. **Tareas antiguas.** `server/package.json` conserva `repurchase:build`, pero el archivo al que apunta aparece eliminado en los cambios actuales. Confirmar que la retirada fue intencional antes de eliminar también el comando.
3. **Imágenes.** La subida del admin usa un preset público de Cloudinary. Revisar restricciones del preset o mover a firma del servidor para limitar abuso. No se cambiaron credenciales ni configuración externa.

## Correcciones posteriores — 14 de octubre

- **Cargo de entrega revisado, no modificado:** el carrito suma $75 debajo de $1,500; Mercado Pago recibe una partida explícita llamada “Envío SportLike”. `server/helpers/createPaidOrder.js` también exige ese importe al validar el pago. No es una comisión calculada por Mercado Pago. Los pedidos por sucursal registran el subtotal de sus productos, por lo que el cargo tampoco queda incluido en esos subtotales. Se requiere decidir el flujo de entrega antes de modificar los tres cálculos.
- **Estadísticas y filtros corregidos:** consultas parametrizadas compartidas para fechas y sucursal por ID; el último día se incluye completo. Resumen, gráficas, estados y pedidos recientes usan los mismos filtros. Los importes y el ticket promedio excluyen cancelados; el conteo de pedidos los conserva. Se admiten los estados históricos `procesando`/`enviado` sin alterar registros de la BD y se presentan como `preparando`/`en_camino`. Los selectores conservan sucursales aunque no tengan ventas en el período. Inventario actual y alertas responden a sucursal (incluidos agotados); las fechas no filtran existencias ni usuarios y productos globales, y se explica en pantalla.
- **CSV corregido:** analizador por celdas, no por líneas. Acepta saltos de línea dentro de comillas, comas, comillas escapadas, CRLF, BOM y archivos con punto y coma. Conserva especificaciones JSON y rechaza encabezados, filas, duplicados internos y precios inválidos antes de importar. Máximo de archivo: 5 MB.
- **Dependencias corregidas:** Axios 1.20.0, React Router 7.18.4, Express 4.22.3, MySQL2 3.24.6, express-rate-limit 8.7.1 y Nodemailer 10.1.1; se actualizaron bloqueos y dependencias transitivas. La herramienta local serve utiliza compression corregido mediante override, sin degradarla a una versión antigua. `npm audit` completo reporta cero vulnerabilidades en ambos proyectos al terminar; no es garantía de ausencia de fallos de la aplicación.
- **Compatibilidad:** se requiere Node 20 o superior; la laptop utiliza Node 22.20.0. Se configuró explícitamente el destino navegador y la resolución de exports en Parcel para React Router 7. Se corrigió SMTP seguro para puerto 465 y se probó la generación de correo en memoria sin enviar mensajes.

Referencias técnicas de compatibilidad: [React Router](https://reactrouter.com/7.18.4/upgrading/v6), [destinos de Parcel](https://parceljs.org/features/targets/), [exports de paquetes en Parcel](https://parceljs.org/features/dependency-resolution/#enabling-package-exports).

## Verificación y alcance

- Compilación de producción y generación PWA.
- Revisión de textos del código público: no se encontraron créditos de generación ni texto de relleno de ese tipo.
- Pruebas de cuenta y PWA con datos ficticios, sin usar la BD real.
- `npm run check:release:browser`: 12 rutas públicas y 12 apartados administrativos, acceso por correo cliente/admin, promociones pausadas, recuperación del resumen y menú móvil. El monitor y los modelos se prueban en estado de servicio no disponible; esto no certifica sus consultas contra producción.
- `node scripts/check-login-promotions.cjs` en servidor: validación, autenticación, JWT, bloqueo de cuenta y pausa de promociones; BD y correo sustituidos.
- `npm run check:csv`: ida y vuelta de CSV multilínea y rechazo de registros inválidos.
- `npm run check:stats` en servidor: estados antiguos/actuales, cancelaciones, último instante del día, sucursal por ID y existencias agotadas con consultas y datos sustituidos.
- `npm run check:mailer` en servidor: SMTP 465/587 y generación MIME en memoria, sin conexión SMTP.
- La revisión de navegador también verifica los filtros del resumen y una importación multilínea completa con API ficticia.

## Publicación

### Acceso con Google corregido

- Cuenta existente: se consulta el perfil real mediante `/api/me`, usando el identificador de la cuenta ya guardada. No se sobrescriben nombre, usuario, correo, teléfono ni contraseña.
- Cuenta nueva: Google devuelve un permiso temporal de registro, no una sesión con acceso privado. Se muestra únicamente el campo para elegir usuario; la BD se escribe después de confirmar uno disponible. Se utilizan nombre y correo verificados por Google y se conserva la restricción de acceso administrativo existente.
- Se validan nombres ocupados, expiración y reintentos; los índices únicos actuales evitan duplicados. No requiere nuevas tablas ni columnas.
- El regreso usa un origen permitido y un estado firmado ligado al navegador. Desde localhost vuelve a localhost; desde el sitio publicado vuelve al sitio publicado. Los tokens viajan en el fragmento de la URL y se retiran del historial al procesarlos.
- Pruebas: `npm run check:google` en servidor y `npm run check:google:browser` en cliente. Google, BD y API se sustituyen por datos de prueba; no se usaron cuentas reales.

Las verificaciones no modificaron ninguna tabla ni dato real. El estado de publicación se confirma por separado al finalizar el despliegue.

El frontend sigue usando el backend configurado en `SPORTLIKE_API_URL` (por defecto el publicado en Vercel). Publicar el frontend nuevo sin publicar el backend nuevo deja incompatible el login por correo. Ambos deben desplegarse coordinadamente. Las cuentas existentes conservan su correo y contraseña.

La pausa de promociones es de código, no un cambio de estado en la BD. Para reactivar, primero implementar y verificar el descuento en el pago, luego habilitar los indicadores de ambos proyectos y publicar juntos.
