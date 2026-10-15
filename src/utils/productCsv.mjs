export const CSV_HEADERS = ['nombre','marca','descripcion','especificaciones','precio','categoria','imagen','talla','colores','activo'];

export function toCSV(rows) {
  const escape = value => {
    const text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    return /[,"\r\n]/.test(text) ? '"'+text.replace(/"/g,'""')+'"' : text;
  };
  return [CSV_HEADERS.join(','),...rows.map(row=>CSV_HEADERS.map(header=>escape(row[header])).join(','))].join('\r\n');
}

export function parseCSV(value) {
  const text = String(value ?? '').replace(/^\uFEFF/,'');
  if (!text.trim()) return [];
  const firstLine = text.split(/\r?\n/,1)[0];
  const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
  const records = []; let cells=[],cell='',quoted=false,closed=false;
  const endCell = () => { cells.push(cell); cell=''; closed=false; };
  const endRecord = () => { endCell(); if (cells.some(item=>item.trim())) records.push(cells); cells=[]; };
  for (let i=0;i<text.length;i++) {
    const char=text[i];
    if (quoted) {
      if (char==='"' && text[i+1]==='"') { cell+='"'; i++; }
      else if (char==='"') { quoted=false; closed=true; }
      else cell+=char;
      continue;
    }
    if (char===delimiter) { endCell(); continue; }
    if (char==='\r' || char==='\n') { endRecord(); if (char==='\r' && text[i+1]==='\n') i++; continue; }
    if (closed) { if (/\s/.test(char)) continue; throw new Error('Hay texto fuera de las comillas de una celda.'); }
    if (char==='"') {
      if (cell.trim()) throw new Error('Hay comillas sin escapar dentro de una celda.');
      cell=''; quoted=true;
    } else cell+=char;
  }
  if (quoted) throw new Error('El CSV tiene una celda con comillas sin cerrar.');
  endRecord();
  if (!records.length) return [];
  const headers=records.shift().map(header=>header.trim().toLowerCase());
  if (new Set(headers).size!==headers.length || headers.some(header=>!header)) throw new Error('Los encabezados no pueden estar vacíos ni repetidos.');
  const unknown=headers.filter(header=>!CSV_HEADERS.includes(header));
  if (unknown.length) throw new Error('Columnas no reconocidas: '+unknown.join(', ')+'. Usa la plantilla de productos.');
  if (!headers.includes('nombre') || !headers.includes('precio')) throw new Error('El CSV debe incluir las columnas nombre y precio.');
  return records.map((record,index)=>{
    if (record.length!==headers.length) throw new Error(`El registro ${index+1} no tiene el mismo número de columnas que el encabezado.`);
    return Object.fromEntries(headers.map((header,i)=>[header,record[i].trim()]));
  });
}

export function validateProductRows(rows) {
  if (!rows.length) throw new Error('El CSV no tiene productos para importar.');
  const names=new Set();
  rows.forEach((row,index)=>{
    const fail=message=>{throw new Error(`Producto ${index+1}: ${message}`);};
    if (!row.nombre?.trim()) fail('falta el nombre.');
    const name=row.nombre.trim().toLowerCase();
    if (names.has(name)) fail('el nombre se repite dentro del archivo.');
    names.add(name);
    if (!/^\d+(?:\.\d{1,2})?$/.test(row.precio || '') || !Number.isFinite(Number(row.precio)) || Number(row.precio)<=0) fail('el precio debe ser mayor que cero y usar punto decimal, sin símbolo de moneda.');
    if (row.activo && !['0','1'].includes(row.activo)) fail('activo debe ser 0 o 1.');
  });
  return rows;
}
