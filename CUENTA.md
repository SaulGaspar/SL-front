# Centro de cuenta SportLike

El perfil usa una cabecera compacta, datos editables a la izquierda y actividad
a la derecha. Debajo conserva tres accesos: pedidos, direcciones y cambios.
No se agregó un bloque de seguridad/preferencias; se conservó el enlace anterior
para cambiar contraseña. Los estilos están en src/styles/account.css y tienen
variantes claras/oscuras y una columna para móvil.

La actividad consulta endpoints existentes, sin tablas nuevas:

- Pedidos activos: pendiente, preparando, en_camino.
- Compras realizadas: pedidos que no estén cancelados.
- Direcciones: direcciones del usuario autenticado.
- Cambios en curso: requested, reviewing, approved.
- Último pedido: el más reciente por fecha.

Las consultas se resuelven independientemente. Un servicio caído se representa
con un guion y opción de reintentar; no se convierte en un contador de cero.

## Direcciones y favoritos

/direcciones permite agregar, editar, elegir predeterminada y eliminar con
confirmación. Reutiliza el formulario y las rutas existentes del checkout.
El módulo de cuenta requiere sesión y conexión; la PWA no guarda respuestas
personales del servidor.

Los corazones del catálogo y la ficha guardan favoritos en localStorage,
separados por ID del usuario o invitado. /favoritos está disponible desde el
menú y el perfil. Son favoritos de este navegador, no se sincronizan con otros
dispositivos. Sus precios/stock se confirman al abrir el producto y comprar.

## Configuración y mantenimiento

src/config/api.js centraliza el backend de todo el frontend. Se puede definir
SPORTLIKE_API_URL en .env, usando un origen sin /api; ver .env.example. Después
hay que reiniciar dev o recompilar. El generador PWA aplica el mismo origen al SW.

Se protegieron /orders, /change-password y /direcciones. Los fallos de red o
sesión no borran el carrito ni las preferencias con localStorage.clear().

Se extrajeron los bloques grandes de estilos de 45 pantallas/componentes a
módulos .styles.js. Se mantienen los style de montaje originales para evitar
que clases heredadas de pantallas diferentes se contaminen entre sí.
Feedback.js y feedback.css comparten presentación y accesibilidad para carga,
vacío, error y éxito en cuenta, catálogo, pedidos y reseñas.

El backend devuelve telefono en GET /api/me, valida los teléfonos al guardar y
devuelve los datos normalizados después de actualizar. Para usar ese arreglo
con sl-back.vercel.app es necesario publicar también el backend modificado.
No se ejecutaron migraciones ni consultas contra la base de datos real.

## Comprobaciones

- npm run build
- npm run check:pwa
- npm run check:pwa:browser
- npm run check:account:browser
- En server: node scripts/check-profile.cjs

Las pruebas de navegador necesitan Playwright y Chrome/Chromium; aceptan las
variables PWA_PLAYWRIGHT_MODULE, PWA_BROWSER_CHANNEL y PWA_SCREENSHOT_DIR.
Usan cuentas, productos y direcciones ficticios, sin escribir a la BD real.
