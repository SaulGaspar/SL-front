const assert = require('node:assert/strict');
async function main() {
  const {toCSV,parseCSV,validateProductRows} = await import('../src/utils/productCsv.mjs');
  const rows=[{nombre:'Balón, edición "Pro"',precio:'299.00',descripcion:'Primera línea\r\nSegunda línea, con "comillas"',especificaciones:'Material: Caucho\nCuidados: Limpiar con paño',talla:'4,5',activo:'1'},{nombre:'Tenis',precio:'799.50',descripcion:'Ligero',activo:'0'}];
  const parsed=validateProductRows(parseCSV('\uFEFF'+toCSV(rows)));
  assert.equal(parsed.length,2);assert.equal(parsed[0].descripcion,rows[0].descripcion);assert.equal(parsed[0].nombre,rows[0].nombre);assert.equal(parsed[0].especificaciones,rows[0].especificaciones);assert.equal(parsed[0].talla,'4,5');assert.equal(parsed[1].activo,'0');
  assert.equal(parseCSV('nombre;precio;descripcion\r\nTenis;799.00;"Ligero; cómodo"')[0].descripcion,'Ligero; cómodo');
  assert.equal(parseCSV('nombre,precio\n\nTenis,799\n\n').length,1);
  for(const source of ['nombre,precio\n"Tenis,799','nombre,nombre,precio\nA,B,10','nombre,precio\nTenis,799,extra','nombre,precio\nTen"is,799','nombre,precio\n"Tenis"basura,799','nobre,precio\nTenis,799','nombre\nTenis']) assert.throws(()=>parseCSV(source));
  for(const source of ['nombre,precio\nTenis,0','nombre,precio\nTenis,-1','nombre,precio\nTenis,1e309','nombre,precio,activo\nTenis,10,2','nombre,precio\nTenis,10\ntenis,20','nombre,precio\n,10','nombre,precio\nTenis,9.999']) assert.throws(()=>validateProductRows(parseCSV(source)));
  assert.equal(JSON.parse(parseCSV(toCSV([{nombre:'Tenis',precio:100,especificaciones:{Material:'Tela'}}]))[0].especificaciones).Material,'Tela');
  console.log('CSV OK: exportación/reimportación multilínea, comillas, comas, CRLF, BOM, punto y coma, JSON y rechazo de filas inválidas antes de importar.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
