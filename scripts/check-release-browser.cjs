// Revisión aislada de pantallas y navegación; todo el backend se sustituye por datos de prueba.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PWA_PLAYWRIGHT_MODULE||'playwright');
const dist=path.resolve(__dirname,'../dist');
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.woff':'font/woff','.woff2':'font/woff2'};
async function main(){
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}if(!path.extname(url.pathname))file=path.join(dist,'index.html');if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const testProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sportlike-release-check-'));let context;
 try{
  context=await chromium.launchPersistentContext(testProfile,{headless:true,channel:process.env.PWA_BROWSER_CHANNEL||'chrome',viewport:{width:1365,height:1000},serviceWorkers:'block'});
  let user={id:7,nombre:'Ana',apellidoP:'Prueba',usuario:'ana_test',correo:'ana@example.test',rol:'cliente'},loginBody,promoRequests=0,failDashboard=false,lastDashboardQuery,importedProduct;
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin===origin)return route.continue();
   if(url.origin!=='https://sl-back.vercel.app')return route.abort();
   let status=200,data=[];
   if(url.pathname==='/api/login'){loginBody=route.request().postDataJSON();user={...user,rol:loginBody.correo==='admin@example.test'?'admin':'cliente'};data={token:'isolated-release-token',user};}
   else if(url.pathname==='/api/me')data=user;
   else if(url.pathname.includes('/promotions')){promoRequests++;status=503;data={error:'Promociones pausadas'};}
   else if(url.pathname==='/api/admin/dashboard'){lastDashboardQuery=url.searchParams.toString();status=failDashboard?503:200;data=failDashboard?{error:'Servicio no disponible'}:{salesTimeline:[],branchRanking:[],topProducts:[],recentOrders:[],resumen:{total_ordenes:5,ingresos_totales:650,preparando:1,en_camino:2},branches:[{id:1,nombre:'Centro'},{id:2,nombre:'Norte'}]};}
   else if(url.pathname==='/api/admin/products'&&route.request().method()==='POST'){importedProduct=route.request().postDataJSON();data={productId:10};}
   else if(url.pathname.endsWith('/stats/summary'))data={resumen:{}};
   else if(url.pathname==='/api/admin/inventory/stats')data={general:{},porSucursal:[]};
   else if(url.pathname.includes('notificaciones')||url.pathname.endsWith('/nuevos'))data={pedidos:[],total:0};
   else if(url.pathname.includes('/monitor')||url.pathname.includes('/backups')||url.pathname.includes('/ml/')){status=503;data={error:'Servicio no disponible en esta prueba'};}
   await route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>{errors.push(error.message);console.error('Error de navegador:',error.message);});
  const publicRoutes=['/','/catalogo','/promociones','/ayuda','/contacto','/tiendas','/aviso-privacidad','/terminos','/configuracion','/login','/register','/forgot-password'];
  for(const url of publicRoutes){await page.goto(origin+url);await page.locator('h1,h2').first().waitFor();assert.ok((await page.locator('body').innerText()).trim().length>100,'Contenido en '+url);assert.ok(!/hecho por ia|generad[oa] por ia|chatgpt|lorem ipsum/i.test(await page.locator('body').innerText()),'Sin textos ajenos en '+url);}
  await page.goto(origin+'/');assert.equal(await page.locator('a[href="/promociones"]').count(),0);await page.getByRole('link',{name:'Conoce nuestras tiendas',exact:true}).waitFor();
  await page.goto(origin+'/promociones');await page.getByRole('heading',{name:'Elige tu categoría',exact:true}).waitFor();assert.equal(await page.getByText('Descuento por dúo',{exact:true}).count(),0);
  await page.goto(origin+'/login');await page.getByLabel('Correo electrónico',{exact:true}).fill('ANA@EXAMPLE.TEST');await page.getByLabel('Contraseña',{exact:true}).fill('Prueba123!');await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForURL(origin+'/');assert.deepEqual(loginBody,{correo:'ana@example.test',password:'Prueba123!'});
  await page.goto(origin+'/login');await page.getByLabel('Correo electrónico',{exact:true}).fill('admin@example.test');await page.getByLabel('Contraseña',{exact:true}).fill('Prueba123!');await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForURL(origin+'/admin');await page.getByRole('heading',{name:'Resumen',exact:true}).first().waitFor();
  for(const section of ['productos','inventario','pedidos','usuarios','sucursales','promociones','devoluciones','resenas','mensajes','reportes','agotamiento','monitor']){
   await page.goto(origin+'/admin/'+section);await page.locator('.admin-content').waitFor();await page.waitForLoadState('networkidle');assert.ok((await page.locator('.admin-content').innerText()).trim().length>5,'Contenido admin '+section);
  }
  assert.equal(promoRequests,0,'Las pantallas pausadas no consultan promociones');
  await page.goto(origin+'/admin/promociones');await page.getByText('Promociones pausadas',{exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:/Nueva promoción/}).count(),0);
  failDashboard=true;await page.goto(origin+'/admin');await page.getByText('No se pudo cargar el resumen completo. Intenta de nuevo para consultar cifras actualizadas.',{exact:true}).waitFor();
  failDashboard=false;await page.getByRole('button',{name:'Volver a intentar',exact:true}).click();await page.locator('.db-kpi-grid').waitFor();
  await page.getByLabel('Desde',{exact:true}).fill('2026-10-14');await page.getByLabel('Hasta',{exact:true}).fill('2026-10-14');await page.getByLabel('Sucursal',{exact:true}).selectOption('1');await page.getByRole('button',{name:'Actualizar',exact:true}).click();await page.locator('.db-kpi-grid').waitFor();
  const sent=new URLSearchParams(lastDashboardQuery);assert.equal(sent.get('branch'),'1');assert.equal(sent.get('from'),'2026-10-14');assert.equal(sent.get('to'),'2026-10-14');assert.equal(await page.getByLabel('Sucursal',{exact:true}).locator('option').count(),3);
  await page.getByLabel('Desde',{exact:true}).fill('2026-10-15');await page.getByRole('button',{name:'Actualizar',exact:true}).click();await page.getByText('La fecha inicial no puede ser posterior a la final.',{exact:true}).waitFor();
  await page.goto(origin+'/admin/productos');await page.locator('input[accept=".csv"]').setInputFiles({name:'multilinea.csv',mimeType:'text/csv',buffer:Buffer.from('nombre,precio,descripcion\r\n"Balón de prueba",299.00,"Primera línea\r\nSegunda línea, con ""comillas"""')});await page.getByRole('heading',{name:'Importar desde CSV',exact:true}).waitFor();await page.getByRole('button',{name:'Confirmar',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.pro-import-preview'));assert.equal(importedProduct.descripcion,'Primera línea\r\nSegunda línea, con "comillas"');assert.equal(importedProduct.precio,299);
  await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('button',{name:'Abrir menú de administración',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#admin-navigation').getBoundingClientRect().x>=-1);
  const nav=await page.locator('#admin-navigation').boundingBox();assert.ok(nav.x>=-1,'Menú móvil visible');await page.locator('#admin-navigation').getByRole('link',{name:'Productos',exact:true}).click();await page.getByRole('button',{name:'Abrir menú de administración',exact:true}).waitFor();
  await page.getByRole('button',{name:'Opciones de mi cuenta',exact:true}).click();await page.getByRole('button',{name:'Cerrar sesión',exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('REVISIÓN WEB OK: 12 rutas públicas y 12 apartados admin, login por correo para cliente/admin, promociones pausadas, errores recuperables y menú móvil. Datos ficticios; sin BD real.');
 }finally{await context?.close();await new Promise(resolve=>server.close(resolve));if(path.dirname(testProfile)===path.resolve(os.tmpdir())&&path.basename(testProfile).startsWith('sportlike-release-check-'))fs.rmSync(testProfile,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
