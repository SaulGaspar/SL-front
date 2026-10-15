# PWA de SportLike

## Archivos y compilación

- `pwa/manifest.webmanifest`: identidad, modo standalone, ámbito, accesos rápidos e iconos.
- `pwa/sw.js`: precaché del arranque y estrategias para catálogo e imágenes.
- `src/context/PwaContext.js`: registro, instalador nativo, conexión y actualizaciones.
- `src/components/PwaInstallNotice.js`: aviso de instalación al entrar al sitio.
- `scripts/build-pwa.cjs`: copia recursos a URLs estables y calcula una versión por contenido.
- `netlify.toml`: publicación de dist, tipos MIME y headers de actualización.

`npm run build` ejecuta Parcel y genera los archivos PWA en dist. Debe publicarse
dist completa, incluido sw.js en la raíz. No hacen falta tablas nuevas.

`npm run dev` escribe en `.parcel-dev`, separado de `dist`, para que el modo de
desarrollo no sobrescriba la PWA compilada. `npm run start -- --listen 1234`
compila primero y después sirve `dist`. No se deben ejecutar dev y start en
el mismo puerto a la vez.

## Instalación

Abrir por HTTPS (Netlify) o localhost. Chrome y Edge pueden mostrar el icono de
instalación en la barra de direcciones cuando consideren la página instalable.
Un aviso discreto aparece después de tres segundos cuando el navegador ofrece
instalación. “Instalar SportLike” abre la invitación nativa mediante
beforeinstallprompt. En Safari para iPhone/iPad muestra las instrucciones de
Compartir > Agregar a pantalla de inicio. No hay botón de instalación dentro
de Configuración. “Ahora no” o cerrar ocultan el aviso durante la sesión de
esa pestaña; no aparece sin conexión ni al usar la app instalada. En navegadores
sin soporte no se promete una instalación que no pueden ofrecer.

El navegador decide cuándo mostrar su invitación nativa; no se puede forzar el
icono de la barra ni instalar en modo incógnito. La app instalada abre en su
propia ventana. No se instala automáticamente en el equipo.

## Uso sin conexión

Después de la primera carga y activación con internet, la app instalada puede
reabrirse sin red. El listado público se prepara al activarse el service worker.
El inicio, las pantallas informativas, el catálogo guardado, los productos
guardados y el carrito funcionan sin conexión. La misma caché también se
aprovecha al navegar en el sitio.

- La estructura, JS, CSS, fuentes de iconos y recursos locales de esta compilación
  se precachean. Las fuentes externas usan la alternativa del sistema sin red.
- Catálogo y detalles públicos: red primero con espera máxima de 5 segundos;
  ante desconexión, timeout o error 5xx se utiliza una copia guardada.
- Si solo existe el listado guardado, se puede abrir una ficha básica desde él.
- Las copias llevan fecha visible y caducan a los 7 días; máximo 50 respuestas.
- Las fotos que se hayan cargado en páginas públicas se guardan; máximo 100.
  Las que nunca se cargaron pueden mostrar un icono de respaldo.
- Los filtros funcionan sobre el catálogo guardado y el carrito persiste en
  localStorage. Al reconectarse se vuelve a consultar el catálogo.
- Pedidos, administración, inicio de sesión, reseñas y pagos requieren red.
  Nunca se cachean sus respuestas autenticadas ni se reenvían escrituras.
- Un fallo de red no borra la sesión, el carrito o las preferencias.
- Si el usuario borra datos del sitio o el navegador libera almacenamiento,
  debe abrir de nuevo con internet para preparar otra copia.

## Actualizaciones

El HTML público y sus bundles se sirven como una unidad de la misma compilación.
El hash cambia si cambian archivos o la plantilla SW. Un worker nuevo espera
hasta que se cierren las ventanas controladas por la versión anterior; no fuerza
recargas durante pagos o formularios. Configuración avisa de versiones pendientes.
Al activarse, se limpian únicamente cachés antiguas de SportLike. Los límites de
almacenamiento y los fallos de cuota no deben romper respuestas de red válidas.

No hay notificaciones push en esta implementación. El permiso de notificaciones
existente no equivale a una suscripción push.

## Comprobación

1. `npm run build`
2. `npm run check:pwa`: valida manifiesto/iconos y ejercita la política del SW.
3. `npm run start -- --listen 1234`; abrir http://localhost:1234.
4. Revisar Application > Manifest y Service Workers en las herramientas del navegador.
5. Instalar, consultar catálogo y fotos, cerrar, desconectar y abrir otra vez.
   Verificar catálogo, filtros, ficha y carrito. Reconectar y verificar actualización.

`npm run check:pwa:browser` es una prueba opcional con Playwright y Chromium/Chrome:
usa un perfil temporal y productos ficticios, sin acceso a la cuenta real.
Necesita Playwright disponible; se puede indicar la ruta del módulo mediante
PWA_PLAYWRIGHT_MODULE y el canal instalado mediante PWA_BROWSER_CHANNEL=chrome.
Valida el reconocimiento del manifiesto, errores de instalación, worker activo,
nueva ventana offline, fotos, carrito persistente y reconexión. No instala una app
en el sistema. PWA_SCREENSHOT_DIR permite guardar capturas de la prueba.

## Ubicación y aviso de conexión

En Configuración hay un acceso a Tiendas. Allí “Usar mi ubicación” solicita
geolocalización solo al pulsarlo. Las coordenadas se conservan únicamente en el
estado de esa pantalla y se usan como origen de la ruta cuando se elige una
tienda en Google Maps. Se puede dejar de usarlas; el permiso se administra en
el navegador. Se manejan permiso denegado, dispositivo incompatible y timeout.
La prueba automatizada usa coordenadas ficticias y no consulta ubicación real.
La ubicación no es un requisito del manifiesto ni de la instalación PWA.

El aviso amarillo “Modo sin conexión” aparece al perder conexión y desaparece
al recuperarla; es un mensaje dentro de la app, no una notificación push.
El manifiesto incluye capturas de escritorio/celular e iconos de 96 píxeles para
los accesos rápidos. Para regenerar capturas reales del inicio puede usarse
PWA_CAPTURE_MANIFEST_SCREENSHOTS=1 con la prueba de navegador y recompilar.
