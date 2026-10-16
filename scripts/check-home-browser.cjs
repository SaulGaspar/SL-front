const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PWA_PLAYWRIGHT_MODULE||'playwright');
const dist=path.resolve(__dirname,'../dist');
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff'};
async function main(){
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}
  if(!path.extname(url.pathname))file=path.join(dist,'index.html');
  if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,channel:process.env.PWA_BROWSER_CHANNEL||'chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
  await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',res=>{if(res.status()>=400)console.error(res.status(),res.url());});await page.goto(origin+'/');
  const slider=page.getByRole('region',{name:'Descubre SportLike'});
  await slider.scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const img=document.querySelector('.sl-home-slide img');return img?.complete&&img.naturalWidth>0;});
  assert.ok(await slider.locator('img').evaluate(img=>img.naturalWidth>0));
  assert.equal(await slider.getByRole('button').count(),0);assert.ok(await slider.locator('.sl-home-slide-tagline').isVisible());
  await slider.hover();await slider.getByRole('link').focus();await page.waitForFunction(()=>document.querySelector('.sl-home-slide-art')?.getAttribute('href')==='/catalogo?categoria=Accesorios',{},{timeout:4500});
  await page.waitForFunction(()=>{const img=document.querySelector('.sl-home-slide img');return img?.complete&&img.naturalWidth>0;});assert.equal(await slider.getByRole('link').getAttribute('href'),'/catalogo?categoria=Accesorios');
  await page.waitForFunction(()=>document.querySelector('.sl-home-slide-art')?.getAttribute('href')==='/catalogo',{},{timeout:4500});await page.waitForFunction(()=>{const img=document.querySelector('.sl-home-slide img');return img?.complete&&img.naturalWidth>0;});
  assert.ok((await slider.locator('img').getAttribute('src')).includes('sportlike-deportes'));assert.equal(await slider.locator('img[src*="running"]').count(),0);
  if(process.env.PWA_SCREENSHOT_DIR){fs.mkdirSync(process.env.PWA_SCREENSHOT_DIR,{recursive:true});await slider.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'slider-deportes.png')});}
  await page.waitForFunction(()=>document.querySelector('.sl-home-slide-art')?.getAttribute('href')==='/catalogo?categoria=Ropa',{},{timeout:4500});
  await slider.hover();
  if(process.env.PWA_SCREENSHOT_DIR){fs.mkdirSync(process.env.PWA_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'slider-escritorio.png')});}
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));
   const nav=page.locator('.nb-mobile-primary');assert.ok(await nav.isVisible());
   assert.ok(await nav.getByRole('link',{name:'Inicio',exact:true}).isVisible());assert.ok(await nav.getByRole('link',{name:'Catálogo',exact:true}).isVisible());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sin desbordamiento a '+width);
  }
  await page.setViewportSize({width:390,height:844});await page.locator('.nb-mobile-primary').getByRole('link',{name:'Catálogo',exact:true}).click();await page.waitForURL(origin+'/catalogo');assert.equal(await page.locator('.nb-mobile-primary a[aria-current=page]').innerText(),'Catálogo');
  await page.locator('.nb-mobile-primary').getByRole('link',{name:'Inicio',exact:true}).click();await page.waitForURL(origin+'/');
  await page.locator('.sl-hero').waitFor();await page.waitForLoadState('networkidle');await page.getByRole('button',{name:'Menú',exact:true}).click();await page.locator('.nb-drawer a[href="/ayuda"]').waitFor();assert.equal(await page.locator('.nb-drawer').getByRole('link',{name:'Catálogo',exact:true}).count(),0);await page.locator('.nb-dclose').click();
  await slider.scrollIntoViewIfNeeded();
  await page.locator('.sl-home-slide').dispatchEvent('touchstart',{touches:[{identifier:0,clientX:280,clientY:300}]});await page.locator('.sl-home-slide').dispatchEvent('touchend',{changedTouches:[{identifier:0,clientX:90,clientY:305}]});await slider.getByRole('link',{name:'Explorar accesorios',exact:true}).waitFor();
  await page.waitForFunction(()=>{const img=document.querySelector('.sl-home-slide img');return img?.complete&&img.naturalWidth>0;});
  if(process.env.PWA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'slider-movil.png')});
  await page.evaluate(()=>localStorage.setItem('sportlike-theme-preference','dark'));await page.reload();await slider.scrollIntoViewIfNeeded();assert.equal(await page.locator('html').getAttribute('data-bs-theme'),'dark');assert.ok(await slider.getByRole('link').isVisible());
  assert.deepEqual(errors,[]);console.log('INICIO OK: tres imágenes del usuario, frases cortas, avance automático cada 3 segundos sin botones, gesto táctil, navegación móvil y modo oscuro. Sin escrituras en BD.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
