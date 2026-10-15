// Pruebas de cuenta en Chrome aislado con API ficticia; no utiliza cuentas ni BD reales.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PWA_PLAYWRIGHT_MODULE||'playwright');
const dist=path.resolve(__dirname,'../dist');
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.woff':'font/woff','.woff2':'font/woff2'};
async function main(){
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}if(!path.extname(url.pathname))file=path.join(dist,'index.html');if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const testProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sportlike-account-check-'));let context;
 try{
  context=await chromium.launchPersistentContext(testProfile,{headless:true,channel:process.env.PWA_BROWSER_CHANNEL||'chrome',viewport:{width:1365,height:1000}});
  let user={id:1,nombre:'Ana',apellidoP:'López',apellidoM:'García',usuario:'ana_test',telefono:'7711234567',correo:'ana@example.test',rol:'cliente'};
  const address=(id,alias,defaultValue=0)=>({id,alias,nombre_receptor:'Ana López',telefono:'7711234567',calle:'Calle Prueba',numero_ext:'12',numero_int:'',colonia:'Centro',ciudad:'Huejutla',estado:'Hidalgo',cp:'43000',tipo:'casa',predeterminada:defaultValue});
  let addresses=[address(1,'Casa',1),address(2,'Oficina')],lastId=2,failAddresses=false,expireSession=false;
  const orders=[{id:1,pedido_ref:'SL-001',status:'pendiente',total:499,fecha:'2026-10-13T12:00:00',items:[]},{id:2,status:'entregado',total:700,fecha:'2026-10-11T12:00:00',items:[]},{id:3,status:'cancelado',total:199,fecha:'2026-10-10T12:00:00',items:[]}];
  const product={id:1,nombre:'Tenis de prueba',precio:499,marca:'SportLike',categoria:'Calzado',stock_total:8,talla:'26',colores:'Negro',imagen:origin+'/icons/icon-192.png'};
  await context.route('https://sl-back.vercel.app/**',async route=>{
   const url=new URL(route.request().url()),method=route.request().method(),body=route.request().postDataJSON()||{};
   let status=200,data={};
   if(url.pathname==='/api/me'){status=expireSession?401:200;data=expireSession?{error:'Sesión expirada'}:user;}
   else if(url.pathname==='/api/update-profile'){user={...user,...body};data={user};}
   else if(url.pathname==='/api/orders/mis-pedidos')data=orders;
   else if(url.pathname==='/api/returns')data=[{id:1,status:'requested'},{id:2,status:'approved'},{id:3,status:'rejected'}];
   else if(url.pathname==='/api/user/addresses'&&method==='GET'){status=failAddresses?503:200;data=failAddresses?{error:'Servicio de direcciones no disponible'}:addresses;}
   else if(url.pathname==='/api/user/addresses'&&method==='POST'){if(body.predeterminada)addresses.forEach(a=>a.predeterminada=0);const created={...body,id:++lastId};addresses.push(created);data=created;}
   else if(url.pathname.startsWith('/api/user/addresses/')){
    const id=Number(url.pathname.split('/')[4]);
    if(method==='PATCH'){addresses.forEach(a=>a.predeterminada=a.id===id?1:0);}
    else if(method==='PUT'){addresses=addresses.map(a=>a.id===id?{...body,id}:a);}
    else if(method==='DELETE'){const wasDefault=addresses.find(a=>a.id===id)?.predeterminada;addresses=addresses.filter(a=>a.id!==id);if(wasDefault&&addresses.length)addresses[0].predeterminada=1;}
   }
   else if(url.pathname==='/api/products')data=[product];
   else if(url.pathname==='/api/products/1')data=product;
   else if(url.pathname.includes('/recommendations'))data={recommendations:[]};
   else if(url.pathname.includes('/reviews'))data={reviews:[],summary:{count:0,average:0}};
   else if(url.pathname.includes('notificaciones'))data=[];
   await route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
  });
  await context.route(/https:\/\/(?:fonts\.(?:googleapis|gstatic)\.com|api\.zippopotam\.us)\//,route=>route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of ['/orders','/change-password','/direcciones']){await page.goto(origin+route);await page.getByRole('heading',{name:'Iniciar sesión',exact:true}).waitFor();}
  await page.evaluate(()=>{localStorage.setItem('token','isolated-account-token');localStorage.setItem('config-preserved','yes');});
  await page.goto(origin+'/profile');await page.getByRole('heading',{name:'Hola, Ana',exact:true}).waitFor();
  await page.locator('.ac-metric').first().getByText('1',{exact:true}).waitFor();
  assert.deepEqual(await page.locator('.ac-metric strong').allTextContents(),['1','2','2','2']);
  await page.getByRole('button',{name:'Editar información',exact:true}).click();
  await page.getByLabel('Teléfono',{exact:true}).fill('7717654321');
  await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();
  await page.getByText('Información actualizada',{exact:true}).waitFor();await page.reload();await page.getByText('7717654321',{exact:true}).waitFor();
  await page.locator('.ac-shortcut').filter({hasText:'Mis direcciones'}).click();await page.getByRole('heading',{name:'Casa',exact:true}).waitFor();
  await page.locator('article').filter({hasText:'Oficina'}).getByRole('button',{name:'Usar como predeterminada',exact:true}).click();
  await page.getByText('Dirección predeterminada actualizada',{exact:true}).waitFor();
  assert.equal(addresses.find(a=>a.id===2).predeterminada,1);
  await page.getByRole('button',{name:'Agregar dirección',exact:true}).click();
  await page.getByPlaceholder('Ej: Casa de mamá',{exact:true}).fill('Casa nueva');
  await page.getByPlaceholder('Nombre completo',{exact:true}).fill('Ana López');
  await page.getByPlaceholder('5512345678',{exact:true}).fill('7711234567');
  await page.getByPlaceholder('Nombre de la calle',{exact:true}).fill('Calle nueva');
  await page.getByPlaceholder('123',{exact:true}).fill('34');
  await page.getByPlaceholder('Busca o escribe tu colonia',{exact:true}).fill('Centro');
  await page.getByPlaceholder('12345',{exact:true}).fill('43000');
  await page.getByPlaceholder('Ciudad',{exact:true}).fill('Huejutla');
  await page.locator('.dch-fg select').selectOption('Hidalgo');
  await page.locator('.dch-btn-save').click();
  await page.getByRole('heading',{name:'Casa nueva',exact:true}).waitFor();assert.equal(addresses.length,3);
  await page.locator('article').filter({hasText:'Casa nueva'}).getByRole('button',{name:'Editar',exact:true}).click();
  await page.getByPlaceholder('Ej: Casa de mamá',{exact:true}).fill('Casa editada');
  await page.locator('.dch-btn-save').click();await page.getByRole('heading',{name:'Casa editada',exact:true}).waitFor();
  await page.locator('article').filter({hasText:'Casa editada'}).getByRole('button',{name:'Eliminar',exact:true}).click();
  await page.getByRole('button',{name:'Confirmar eliminación',exact:true}).click();await page.getByText('Dirección eliminada',{exact:true}).waitFor();assert.equal(addresses.length,2);
  await page.goto(origin+'/catalogo');await page.getByRole('button',{name:'Guardar en favoritos: Tenis de prueba',exact:true}).click();
  await page.goto(origin+'/favoritos');await page.getByRole('heading',{name:'Tenis de prueba',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:'Tenis de prueba',exact:true}).waitFor();
  await page.goto(origin+'/profile');await page.getByRole('link',{name:'Favoritos (1)',exact:true}).waitFor();
  if(process.env.PWA_SCREENSHOT_DIR){fs.mkdirSync(process.env.PWA_SCREENSHOT_DIR,{recursive:true});await page.locator('.ac-page').screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'perfil-claro.png')});}
  failAddresses=true;await page.reload();await page.getByText('No se pudo cargar parte de tu actividad.',{exact:true}).waitFor();assert.equal(await page.locator('.ac-metric strong').nth(2).innerText(),'—');
  failAddresses=false;await page.getByRole('button',{name:'Volver a intentar',exact:true}).click();await page.locator('.sl-feedback-error').waitFor({state:'detached'});
  await page.goto(origin+'/configuracion');await page.getByRole('button',{name:'Oscuro',exact:true}).click();await page.getByRole('button',{name:'Guardar cambios',exact:true}).click();await page.waitForFunction(()=>document.body.dataset.bsTheme==='dark');await page.goto(origin+'/profile');await page.getByRole('heading',{name:'Hola, Ana',exact:true}).waitFor();
  assert.equal(await page.locator('body').getAttribute('data-bs-theme'),'dark');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  if(process.env.PWA_SCREENSHOT_DIR)await page.locator('.ac-page').screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'perfil-oscuro.png'),animations:'disabled'});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Perfil sin desbordamiento móvil');
  if(process.env.PWA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'perfil-movil.png'),fullPage:true});
  await page.goto(origin+'/direcciones');await page.getByRole('heading',{name:'Casa',exact:true}).waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Direcciones sin desbordamiento móvil');
  expireSession=true;await page.goto(origin+'/orders');await page.getByRole('heading',{name:'Iniciar sesión',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('token')),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('config-preserved')),'yes');
  await page.goto(origin+'/favoritos');await page.getByText('Aún no tienes favoritos',{exact:true}).waitFor();
  assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('sportlike-favorites:1'))).length,1);
  assert.deepEqual(errors,[]);
  console.log('CUENTA OK: rutas protegidas, actividad real, teléfono persistente, altas/edición/predeterminada/eliminación de direcciones, favoritos persistentes por usuario, errores recuperables, temas claro/oscuro y móvil. API ficticia; sin tocar datos reales.');
 }finally{await context?.close();await new Promise(resolve=>server.close(resolve));if(path.dirname(testProfile)===path.resolve(os.tmpdir())&&path.basename(testProfile).startsWith('sportlike-account-check-'))fs.rmSync(testProfile,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
