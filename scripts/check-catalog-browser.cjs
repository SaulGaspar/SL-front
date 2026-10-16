const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PWA_PLAYWRIGHT_MODULE||'playwright');
const dist=path.resolve(__dirname,'../dist'),types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.woff':'font/woff','.woff2':'font/woff2'};
async function main(){
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}if(!path.extname(url.pathname))file=path.join(dist,'index.html');if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 const testProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sportlike-catalog-check-'));let context;
 try{
  context=await chromium.launchPersistentContext(testProfile,{headless:true,channel:process.env.PWA_BROWSER_CHANNEL||'chrome',viewport:{width:1440,height:1050},serviceWorkers:'block'});
  const products=Array.from({length:240},(_,index)=>({id:index+1,nombre:'Producto '+String(index+1).padStart(3,'0'),precio:100+index+1,marca:index%2?'Nike':'Adidas',categoria:index<160?'Calzado':'Accesorios',stock_total:8,descripcion:'Producto deportivo de prueba.',imagen:origin+'/icons/icon-192.png',talla:'26,27,28',colores:'Negro,Blanco'}));
  await context.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin===origin)return route.continue();if(url.origin!=='https://sl-back.vercel.app')return route.abort();await route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*','X-SportLike-Offline':'1','X-SportLike-Saved-At':new Date().toISOString()},body:JSON.stringify(url.pathname==='/api/products'?products:/^\/api\/products\/\d+$/.test(url.pathname)?products.find(p=>p.id===Number(url.pathname.split('/').pop())):[])});});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(origin+'/catalogo');await page.locator('.sl-card').first().waitFor();
  assert.equal(await page.locator('.sl-card').count(),40);assert.equal(await page.locator('.sl-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),4);
  assert.equal(await page.locator('.sl-card').evaluateAll(cards=>new Set(cards.map(card=>card.offsetTop)).size),10);
  assert.equal(await page.getByText(/Mostrando \d|Estás viendo una copia guardada/).count(),0);
  const sidebar=await page.locator('#catalog-filters').boundingBox(),grid=await page.locator('.sl-grid').boundingBox();assert.ok(sidebar.x<grid.x&&sidebar.x+sidebar.width<=grid.x,'Filtros a la izquierda');
  if(process.env.PWA_SCREENSHOT_DIR){fs.mkdirSync(process.env.PWA_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'catalogo-lateral-escritorio.png')});}
  await page.getByRole('button',{name:'Siguiente',exact:true}).click();await page.getByText('Producto 041',{exact:true}).waitFor();assert.equal(new URL(page.url()).searchParams.get('pagina'),'2');
  const selectControl=async locator=>{await locator.click();await page.waitForFunction(el=>el.checked,await locator.elementHandle());};
  await selectControl(page.getByRole('radio',{name:/^Calzado/}));await selectControl(page.getByRole('checkbox',{name:/^Nike/}));await page.getByRole('searchbox',{name:'Buscar',exact:true}).fill('Producto');await page.getByRole('button',{name:'Siguiente',exact:true}).click();
  let params=new URL(page.url()).searchParams;assert.equal(params.get('categoria'),'Calzado');assert.equal(params.get('marca'),'Nike');assert.equal(params.get('q'),'Producto');assert.equal(params.get('pagina'),'2');
  await page.reload();await page.locator('.sl-card').first().waitFor();assert.equal(await page.getByRole('checkbox',{name:/^Nike/}).isChecked(),true);assert.equal(await page.getByRole('button',{name:'Página 2',exact:true}).getAttribute('aria-current'),'page');
  await page.getByRole('slider',{name:'Precio máximo',exact:false}).press('Home');await page.getByText('No encontramos productos',{exact:true}).waitFor();assert.equal(await page.locator('.sl-pagination').count(),0);assert.equal(new URL(page.url()).searchParams.get('pagina'),null);
  await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.sl-card').length===40);
  await selectControl(page.getByRole('checkbox',{name:/^Nike/}));await selectControl(page.getByRole('checkbox',{name:/^Adidas/}));assert.deepEqual(new URL(page.url()).searchParams.getAll('marca'),['Nike','Adidas']);
  await page.getByLabel('Ordenar por',{exact:true}).selectOption('precio-desc');await page.waitForFunction(()=>document.querySelector('.sl-card-name')?.textContent==='Producto 240');
  await page.getByRole('button',{name:'Quitar filtro Nike',exact:true}).click();await page.waitForURL(url=>url.searchParams.getAll('marca').length===1);assert.deepEqual(new URL(page.url()).searchParams.getAll('marca'),['Adidas']);
  assert.equal(await page.getByRole('switch',{name:/Solo disponibles/}).count(),0);assert.equal(await page.locator('.sl-filter-option small').count(),0);
  await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();await page.waitForURL(url=>!url.search);
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelectorAll('.sl-card').length===16);
  assert.equal(await page.locator('.sl-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);assert.equal(await page.locator('.sl-card').evaluateAll(cards=>new Set(cards.map(card=>card.offsetTop)).size),8);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sin desbordamiento móvil');
  await page.getByRole('button',{name:'Filtros',exact:true}).click();await selectControl(page.getByRole('radio',{name:/^Accesorios/}));assert.ok(await page.getByRole('checkbox',{name:/^Nike/}).isVisible());await page.getByRole('button',{name:'Ver productos',exact:true}).click();assert.equal(await page.locator('.sl-card').count(),16);
  if(process.env.PWA_SCREENSHOT_DIR){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'catalogo-lateral-movil.png')});}
  await page.getByRole('button',{name:'Siguiente',exact:true}).click();assert.equal(new URL(page.url()).searchParams.get('categoria'),'Accesorios');assert.equal(await page.locator('.sl-card').count(),16);assert.deepEqual(errors,[]);
  await page.getByRole('button',{name:'Filtros',exact:true}).click();
  if(process.env.PWA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'filtros-movil.png')});
  await page.evaluate(()=>localStorage.setItem('sportlike-theme-preference','dark'));await page.setViewportSize({width:1440,height:1050});await page.reload();await page.locator('.sl-card').first().waitFor();
  assert.equal(await page.locator('html').getAttribute('data-bs-theme'),'dark');assert.equal(await page.locator('#catalog-filters').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(30, 41, 59)');
  if(process.env.PWA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'filtros-oscuro.png')});
  await page.goto(origin+'/catalogo');await page.setViewportSize({width:390,height:844});await page.locator('.sl-card').first().waitFor();await page.getByRole('button',{name:'Elegir opciones',exact:true}).first().click();await page.waitForURL(origin+'/producto/1');
  await page.getByRole('button',{name:'Agregar al carrito',exact:true}).first().click();await page.getByRole('alert').filter({hasText:'Elige la talla'}).waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cart')||'[]').length),0);
  await page.getByRole('button',{name:'27',exact:true}).click();await page.getByRole('button',{name:'Color Negro',exact:true}).click();await page.getByRole('button',{name:'Agregar al carrito',exact:true}).first().click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('cart')||'[]').length===1);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('cart')));assert.equal(saved[0].size,'27');assert.equal(saved[0].color,'Negro');
  console.log('CATÁLOGO OK: 4 columnas escritorio/2 móvil, 40/16 productos, filtros, paginación y selección explícita de talla/color. API ficticia.');
 }finally{await context?.close();await new Promise(resolve=>server.close(resolve));if(path.dirname(testProfile)===path.resolve(os.tmpdir())&&path.basename(testProfile).startsWith('sportlike-catalog-check-'))fs.rmSync(testProfile,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
