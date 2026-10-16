// Flujo de regreso de Google con API ficticia y navegador aislado.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PWA_PLAYWRIGHT_MODULE||'playwright');
const dist=path.resolve(__dirname,'../dist'),types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.woff':'font/woff','.woff2':'font/woff2'};
async function main(){
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403).end();return;}if(!path.extname(url.pathname))file=path.join(dist,'index.html');if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 const testProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sportlike-google-browser-'));let context;
 try{
  context=await chromium.launchPersistentContext(testProfile,{headless:true,channel:process.env.PWA_BROWSER_CHANNEL||'chrome',viewport:{width:1365,height:1000},serviceWorkers:'block'});
  let user={id:7,nombre:'Ana',apellidoP:'Guardado',apellidoM:'Real',usuario:'ana_guardada',correo:'ana@example.test',telefono:'7711234567',rol:'cliente'},completeCalls=0;
  await context.route('**/*',async route=>{
   const req=route.request(),url=new URL(req.url());if(url.origin===origin)return route.continue();if(url.origin!=='https://sl-back.vercel.app')return route.abort();
   let status=200,data=[];
   if(url.pathname==='/api/me'){status=req.headers().authorization==='Bearer bad-token'?401:200;data=status===401?{error:'Sesión inválida'}:user;}
   if(url.pathname==='/api/google/registration')data={correo:'nuevo@example.test',nombre:'Carlos'};
   if(url.pathname==='/api/google/complete'){
    completeCalls++;const body=req.postDataJSON();assert.deepEqual(Object.keys(body),['usuario']);
    if(body.usuario==='ocupado'){status=409;data={error:'Ese nombre de usuario ya está ocupado. Elige otro.'};}
    else{user={id:8,nombre:'Carlos',apellidoP:'De Google',apellidoM:'',usuario:body.usuario,correo:'nuevo@example.test',telefono:null,rol:'cliente'};data={token:'new-google-token',user};}
   }
   await route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+'/google-callback#token=existing-google-token');await page.waitForURL(origin+'/');await page.locator('.sl-hero').waitFor();await page.goto(origin+'/profile');await page.getByRole('heading',{name:'Hola, Ana',exact:true}).waitFor();await page.getByText('7711234567',{exact:true}).waitFor();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('user')));assert.equal(saved.usuario,'ana_guardada');assert.equal(saved.correo,'ana@example.test');assert.equal(saved.nombre,'Ana');assert.equal(completeCalls,0);
  await page.goto(origin+'/google-callback#registration_token=pending-google-token');await page.getByRole('heading',{name:'Elige tu nombre de usuario',exact:true}).waitFor();assert.equal(await page.locator('.gc-form input').count(),1);assert.equal(await page.evaluate(()=>localStorage.getItem('token')),null);assert.equal(new URL(page.url()).hash,'');assert.equal(completeCalls,0);
  await page.reload();await page.getByRole('heading',{name:'Elige tu nombre de usuario',exact:true}).waitFor();
  await page.getByLabel('Nombre de usuario',{exact:true}).fill('ocupado');await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();await page.getByText('Ese nombre de usuario ya está ocupado. Elige otro.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('token')),null);
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Formulario sin desbordamiento móvil');
  if(process.env.PWA_SCREENSHOT_DIR){fs.mkdirSync(process.env.PWA_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.PWA_SCREENSHOT_DIR,'google-nuevo-usuario.png'),fullPage:true});}
  await page.getByLabel('Nombre de usuario',{exact:true}).fill('carlos_deporte');await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();await page.waitForURL(origin+'/');await page.locator('.sl-hero').waitFor();assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('user')))).usuario,'carlos_deporte');assert.equal(await page.evaluate(()=>sessionStorage.getItem('sportlike_google_signup')),null);
  await page.goto(origin+'/google-callback?token=bad-token');await page.getByRole('heading',{name:'No pudimos iniciar sesión',exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('token')),null);assert.equal(new URL(page.url()).search,'');
  await page.goto(origin+'/google-callback');await page.getByRole('heading',{name:'No pudimos iniciar sesión',exact:true}).waitFor();assert.deepEqual(errors,[]);
  console.log('GOOGLE WEB OK: cuenta existente con datos reales, registro nuevo con un solo campo, refresco, usuario ocupado, perfil final, credenciales inválidas sin sesión y móvil. API ficticia.');
 }finally{await context?.close();await new Promise(resolve=>server.close(resolve));if(path.dirname(testProfile)===path.resolve(os.tmpdir())&&path.basename(testProfile).startsWith('sportlike-google-browser-'))fs.rmSync(testProfile,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
