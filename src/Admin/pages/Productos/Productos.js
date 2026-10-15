import { API_BASE_URL } from "../../../config/api";
import { CSV_HEADERS, toCSV, parseCSV, validateProductRows } from "../../../utils/productCsv.mjs";
import React, { useState, useEffect, useRef } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh,
  MdClose, MdCheckCircle, MdInventory,
  MdFileDownload, MdFileUpload, MdWarning,
  MdDateRange, MdCloudUpload,
} from "react-icons/md";

const API_URL          = API_BASE_URL;
const CLOUDINARY_CLOUD = "dt1vnxvjq";
const CLOUDINARY_PRESET= "Sportlike";
const CLOUDINARY_URL   = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

const token   = () => localStorage.getItem("token");
const hdrs    = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });
const fmt     = (v) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v || 0);
const EMPTY   = { nombre: "", marca: "", descripcion: "", especificaciones: "", precio: "", categoria: "", imagen: "", talla: "", colores: "", activo: 1 };
const IMPORTANT_FIELDS = { nombre:"Nombre", marca:"Marca", descripcion:"Descripción", precio:"Precio", categoria:"Categoría", imagen:"Imagen", talla:"Tallas", colores:"Colores" };

import CSS from "./Productos.styles";

const COLOR_MAP = {
  negro:"#111",blanco:"#fff",rojo:"#e53e3e",azul:"#3182ce",verde:"#38a169",
  amarillo:"#d69e2e",naranja:"#dd6b20",morado:"#805ad5",rosa:"#d53f8c",
  gris:"#718096",cafe:"#92400e",beige:"#d4a574",navy:"#1e3a5f",celeste:"#63b3ed",
};

function ColorDots({ value }) {
  if (!value) return <span style={{color:"#a0aec0",fontSize:".75rem"}}>—</span>;
  const colores = value.split(",").map(s=>s.trim()).filter(Boolean);
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:"4px",alignItems:"center"}}>
      {colores.slice(0,6).map(c=>{
        const hex=COLOR_MAP[c.toLowerCase()];
        return hex?<span key={c} className="pro-color-dot" style={{background:hex}} title={c}/>:<span key={c} className="pro-chip">{c}</span>;
      })}
      {colores.length>6&&<span className="pro-chip">+{colores.length-6}</span>}
    </div>
  );
}

function TallaChips({ value }) {
  if (!value) return <span style={{color:"#a0aec0",fontSize:".75rem"}}>—</span>;
  const tallas=value.split(",").map(s=>s.trim()).filter(Boolean);
  return (
    <div className="pro-chips">
      {tallas.slice(0,4).map(t=><span key={t} className="pro-chip">{t}</span>)}
      {tallas.length>4&&<span className="pro-chip">+{tallas.length-4}</span>}
    </div>
  );
}

async function uploadToCloudinary(file) {
  if (!file.type.startsWith("image/")) throw new Error("Solo se permiten imágenes");
  if (file.size > 10*1024*1024) throw new Error("Máximo 10 MB");
  const fd=new FormData();
  fd.append("file",file);
  fd.append("upload_preset",CLOUDINARY_PRESET);
  const res=await fetch(CLOUDINARY_URL,{method:"POST",body:fd});
  if (!res.ok) throw new Error("Error al subir imagen");
  const data=await res.json();
  return data.secure_url;
}

function ImageUploader({ value, onChange }) {
  const [uploading,setUploading]=useState(false);
  const [progress,setProgress]=useState(0);
  const [drag,setDrag]=useState(false);
  const [showUrl,setShowUrl]=useState(false);
  const fileRef=useRef();

  const handleUpload=async(file)=>{
    setUploading(true);setProgress(10);
    const timer=setInterval(()=>setProgress(p=>Math.min(p+15,85)),300);
    try{const url=await uploadToCloudinary(file);clearInterval(timer);setProgress(100);onChange(url);}
    catch(e){clearInterval(timer);alert(e.message);}
    finally{setTimeout(()=>{setUploading(false);setProgress(0);},400);}
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div
        className={`img-drop-zone ${drag?"drag":""} ${value&&!uploading?"has-img":""}`}
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handleUpload(f);}}
        onClick={()=>!value&&!uploading&&fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f)handleUpload(f);e.target.value="";}}/>
        {uploading&&(
          <div className="img-uploading">
            <MdCloudUpload size={28} style={{color:"#3182ce"}}/>
            <span style={{fontSize:".84rem",fontWeight:700,color:"#2b6cb0"}}>Subiendo imagen…</span>
            <div className="img-upload-bar"><div className="img-upload-bar-fill" style={{width:`${progress}%`}}/></div>
          </div>
        )}
        {!uploading&&value&&(
          <div className="img-preview-wrap">
            <img src={value} alt="preview"/>
            <div className="img-preview-overlay">
              <button className="img-overlay-btn change" onClick={e=>{e.stopPropagation();fileRef.current?.click();}}><MdCloudUpload size={14}/> Cambiar</button>
              <button className="img-overlay-btn remove" onClick={e=>{e.stopPropagation();onChange("");}}><MdClose size={14}/> Quitar</button>
            </div>
          </div>
        )}
        {!uploading&&!value&&(
          <div className="img-drop-placeholder">
            <MdCloudUpload size={32}/>
            <span>Arrastra una imagen aquí</span>
            <small>o haz clic · JPG, PNG, WEBP · máx 10 MB</small>
          </div>
        )}
      </div>
      <button className="img-url-toggle" onClick={()=>setShowUrl(v=>!v)}>
        {showUrl?"▲ Ocultar URL":"▼ O pega una URL de imagen"}
      </button>
      {showUrl&&(
        <input style={{padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:".88rem",fontFamily:"inherit",background:"#f8fafc"}}
          placeholder="https://res.cloudinary.com/…" value={value} onChange={e=>onChange(e.target.value)}/>
      )}
    </div>
  );
}

function ImageGallery({ productId, onMainChange }) {
  const [images,setImages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef();

  const fetchImages=async()=>{
    if(!productId)return;
    setLoading(true);
    try{
      const res=await fetch(`${API_URL}/api/admin/products/${productId}/images`,{headers:hdrs()});
      if(res.ok)setImages(await res.json());
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  useEffect(()=>{fetchImages();},[productId]);

  const handleAdd=async(file)=>{
    setUploading(true);
    try{
      const url=await uploadToCloudinary(file);
      const res=await fetch(`${API_URL}/api/admin/products/${productId}/images`,{
        method:"POST",headers:hdrs(),body:JSON.stringify({url})
      });
      if(res.ok){
        await fetchImages();
        if(images.length===0)onMainChange?.(url);
      }
    }catch(e){alert(e.message);}
    finally{setUploading(false);}
  };

  const handleDelete=async(imgId)=>{
    if(!confirm("¿Eliminar esta imagen?"))return;
    const res=await fetch(`${API_URL}/api/admin/products/images/${imgId}`,{method:"DELETE",headers:hdrs()});
    if(res.ok){
      const updated=images.filter(i=>i.id!==imgId);
      setImages(updated);
      onMainChange?.(updated[0]?.url||"");
    }
  };

  const handleSetMain=async(img)=>{
    const reordered=[img,...images.filter(i=>i.id!==img.id)].map((i,idx)=>({...i,orden:idx}));
    await fetch(`${API_URL}/api/admin/products/images/reorder`,{
      method:"PATCH",headers:hdrs(),
      body:JSON.stringify({product_id:productId,images:reordered.map(i=>({id:i.id,orden:i.orden}))})
    });
    setImages(reordered);
    onMainChange?.(img.url);
  };

  if(!productId)return(
    <div className="mg-info">💡 Guarda el producto primero para agregar más imágenes.</div>
  );

  return(
    <div className="mg-wrap">
      {loading?(
        <div style={{textAlign:"center",color:"#a0aec0",padding:"20px",fontSize:".84rem"}}>Cargando imágenes…</div>
      ):(
        <div className="mg-grid">
          {images.map((img,idx)=>(
            <div key={img.id} className={`mg-item ${idx===0?"is-main":""}`}>
              {idx===0&&<span className="mg-main-badge">PRINCIPAL</span>}
              <img src={img.url} alt={`img-${idx}`}/>
              <div className="mg-item-actions">
                {idx!==0&&<button className="mg-item-btn main" onClick={()=>handleSetMain(img)}>⭐ Principal</button>}
                <button className="mg-item-btn del" onClick={()=>handleDelete(img.id)}><MdDelete size={12}/> Eliminar</button>
              </div>
            </div>
          ))}
          <div className="mg-add-btn" onClick={()=>!uploading&&fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f)handleAdd(f);e.target.value="";}}/>
            {uploading?(
              <MdRefresh size={22} className="spinning" style={{color:"#3182ce"}}/>
            ):(
              <><MdCloudUpload size={22} style={{color:"#90cdf4"}}/><span>Agregar foto</span></>
            )}
          </div>
        </div>
      )}
      <div className="mg-info">
        La imagen <strong>PRINCIPAL</strong> aparece en catálogo y detalle. Haz clic en "⭐ Principal" para cambiarla.
      </div>
    </div>
  );
}

// CSV helpers
function downloadCSV(content,filename){
  const blob=new Blob(["\uFEFF"+content],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
function analyzeEmptyFields(rows){
  const counts={};
  Object.keys(IMPORTANT_FIELDS).forEach(f=>{counts[f]=0;});
  rows.forEach(p=>{Object.keys(IMPORTANT_FIELDS).forEach(f=>{if(!p[f]&&p[f]!==0)counts[f]++;});});
  return counts;
}

export default function Productos() {
  const [products,setProducts]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [savedId,setSavedId]=useState(null);
  const [form,setForm]=useState(EMPTY);
  const [formErr,setFormErr]=useState("");
  const [search,setSearch]=useState("");
  const [catFilter,setCat]=useState("all");
  const [brandFilter,setBrand]=useState("all");
  const [statusFilter,setStatus]=useState("all");
  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");
  const [toast,setToast]=useState(null);
  const [showExport,setShowExport]=useState(false);
  const [exportData,setExportData]=useState([]);
  const [emptyFields,setEmptyFields]=useState({});
  const [showImport,setShowImport]=useState(false);
  const [importRows,setImportRows]=useState([]);
  const [importDups,setImportDups]=useState([]);
  const [dupAction,setDupAction]=useState(null);
  const [importing,setImporting]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [showSummary,setShowSummary]=useState(false);
  const [importResult,setImportResult]=useState(null);
  const fileRef=useRef();

  useEffect(()=>{fetchProducts();},[]);
  useEffect(()=>{
    let f=[...products];
    if(search)f=f.filter(p=>`${p.nombre} ${p.marca} ${p.descripcion}`.toLowerCase().includes(search.toLowerCase()));
    if(catFilter!=="all")f=f.filter(p=>p.categoria===catFilter);
    if(brandFilter!=="all")f=f.filter(p=>p.marca===brandFilter);
    if(statusFilter==="active")f=f.filter(p=>p.activo===1);
    if(statusFilter==="inactive")f=f.filter(p=>p.activo===0);
    if(dateFrom){const from=new Date(dateFrom+"T00:00:00");f=f.filter(p=>{const d=p.created_at||p.updated_at;return d?new Date(d)>=from:true;});}
    if(dateTo){const to=new Date(dateTo+"T23:59:59");f=f.filter(p=>{const d=p.created_at||p.updated_at;return d?new Date(d)<=to:true;});}
    setFiltered(f);
  },[products,search,catFilter,brandFilter,statusFilter,dateFrom,dateTo]);

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const fetchProducts=async()=>{
    setLoading(true);
    try{const res=await fetch(`${API_URL}/api/admin/products`,{headers:hdrs()});if(res.ok)setProducts(await res.json());}
    catch(e){console.error(e);}finally{setLoading(false);}
  };

  const handleExportPreview=()=>{const data=filtered;setExportData(data);setEmptyFields(analyzeEmptyFields(data));setShowExport(true);};
  const handleExportConfirm=()=>{downloadCSV(toCSV(exportData),`productos_${new Date().toISOString().slice(0,10)}.csv`);setShowExport(false);showToast(`✅ ${exportData.length} productos exportados`);};
  const handleExportTemplate=()=>{const ex=[{nombre:"Ejemplo",marca:"Marca",descripcion:"Desc",especificaciones:'{"Material":"Poliéster","Cuidados":"Lavar con agua fría"}',precio:"299.00",categoria:"Calzado",imagen:"https://...",talla:"S,M,L",colores:"Negro,Blanco",activo:1}];downloadCSV(toCSV(ex),"plantilla_productos.csv");};

  const handleFileRead=(file)=>{
    if(!file)return;
    if(file.size>5*1024*1024){showToast("El CSV no debe superar 5 MB.","err");return;}
    const reader=new FileReader();
    reader.onload=(e)=>{
      try {
      const valid=validateProductRows(parseCSV(e.target.result));
      const existingNames=new Set(products.map(p=>p.nombre.toLowerCase().trim()));
      const dups=valid.filter(r=>existingNames.has(r.nombre.toLowerCase().trim()));
      setImportRows(valid);setImportDups(dups);setDupAction(dups.length>0?null:"skip");setShowImport(true);
      } catch(error) { showToast(error.message || "No se pudo leer el CSV.","err"); }
    };
    reader.onerror=()=>showToast("No se pudo abrir el archivo. Intenta seleccionarlo de nuevo.","err");
    reader.readAsText(file,"UTF-8");
  };
  const handleDrop=(e)=>{e.preventDefault();setDragOver(false);const file=e.dataTransfer.files[0];if(file?.name.endsWith(".csv"))handleFileRead(file);else showToast("Solo se aceptan .csv","err");};
  const handleImportConfirm=async()=>{
    if(importDups.length>0&&!dupAction)return;
    setImporting(true);
    const existingNames=new Map(products.map(p=>[p.nombre.toLowerCase().trim(),p.id]));
    let created=0,updated=0,skipped=0,errors=0;
    for(const row of importRows){
      const isDup=existingNames.has(row.nombre.toLowerCase().trim());
      try{
        if(isDup&&dupAction==="skip"){skipped++;continue;}
        const payload={nombre:row.nombre,marca:row.marca||"",descripcion:row.descripcion||"",especificaciones:row.especificaciones||"",precio:parseFloat(row.precio)||0,categoria:row.categoria||"",imagen:row.imagen||"",talla:row.talla||"",colores:row.colores||"",activo:parseInt(row.activo)===0?0:1};
        if(isDup&&dupAction==="update"){const id=existingNames.get(row.nombre.toLowerCase().trim());const res=await fetch(`${API_URL}/api/admin/products/${id}`,{method:"PUT",headers:hdrs(),body:JSON.stringify(payload)});if(res.ok)updated++;else errors++;}
        else{const res=await fetch(`${API_URL}/api/admin/products`,{method:"POST",headers:hdrs(),body:JSON.stringify(payload)});if(res.ok)created++;else errors++;}
      }catch{errors++;}
    }
    setImporting(false);setShowImport(false);setImportRows([]);fetchProducts();
    setImportResult({created,updated,skipped,errors,total:importRows.length});setShowSummary(true);
  };

  const openCreate=()=>{setEditing(null);setSavedId(null);setForm(EMPTY);setFormErr("");setShowModal(true);};
  const openEdit=(p)=>{
    setEditing(p);setSavedId(p.id);
    const especificaciones = typeof p.especificaciones === "string"
      ? (()=>{try{return Object.entries(JSON.parse(p.especificaciones)).map(([campo,detalle])=>`${campo}: ${detalle}`).join("\n");}catch{return p.especificaciones;}})()
      : Object.entries(p.especificaciones||{}).map(([campo,detalle])=>`${campo}: ${detalle}`).join("\n");
    setForm({nombre:p.nombre||"",marca:p.marca||"",descripcion:p.descripcion||"",especificaciones,precio:p.precio||"",categoria:p.categoria||"",imagen:p.imagen||"",talla:p.talla||"",colores:p.colores||"",activo:p.activo??1});
    setFormErr("");setShowModal(true);
  };
  const closeModal=()=>{setShowModal(false);setEditing(null);setSavedId(null);setFormErr("");fetchProducts();};
  const set=(key)=>(e)=>setForm(f=>({...f,[key]:e.target.value}));

  const handleSave=async()=>{
    if(!form.nombre.trim()){setFormErr("El nombre es obligatorio");return;}
    if(!form.precio||isNaN(Number(form.precio))||Number(form.precio)<0){setFormErr("Ingresa un precio válido");return;}
    setFormErr("");setSaving(true);
    try{
      const url=editing?`${API_URL}/api/admin/products/${editing.id}`:`${API_URL}/api/admin/products`;
      const method=editing?"PUT":"POST";
      const res=await fetch(url,{method,headers:hdrs(),body:JSON.stringify({...form,precio:Number(form.precio)})});
      const data=await res.json();
      if(res.ok){
        const newId=editing?editing.id:data.productId;
        setSavedId(newId);
        if(!editing)setEditing({...form,id:newId});
        showToast(editing?"Producto actualizado":"Producto creado — agrega más imágenes abajo");
        fetchProducts();
      }else{setFormErr(data.error||"Error al guardar");}
    }catch{setFormErr("Error de conexión.");}
    finally{setSaving(false);}
  };

  const handleDelete=async(id,nombre)=>{
    if(!confirm(`¿Desactivar "${nombre}"?`))return;
    try{
      const res=await fetch(`${API_URL}/api/admin/products/${id}`,{method:"DELETE",headers:hdrs()});
      if(res.ok){showToast("Producto desactivado");fetchProducts();}
      else{const d=await res.json();showToast(d.error||"Error","err");}
    }catch{showToast("Error de conexión","err");}
  };

  const hasDateFilter=dateFrom||dateTo;
  const categories=[...new Set(products.map(p=>p.categoria).filter(Boolean))];
  const brands=[...new Set(products.map(p=>p.marca).filter(Boolean))];
  const tallasPreview=form.talla?form.talla.split(",").map(s=>s.trim()).filter(Boolean):[];
  const coloresPreview=form.colores?form.colores.split(",").map(s=>s.trim()).filter(Boolean):[];
  const warnFields=exportData.length>0?Object.entries(emptyFields).filter(([,c])=>c>0).map(([f])=>f):[];
  const hasActiveFilters=Boolean(search||catFilter!=="all"||brandFilter!=="all"||statusFilter!=="all"||dateFrom||dateTo);
  const exportFilters=[
    search&&`Búsqueda: ${search}`,
    catFilter!=="all"&&`Categoría: ${catFilter}`,
    brandFilter!=="all"&&`Marca: ${brandFilter}`,
    statusFilter!=="all"&&`Estado: ${statusFilter==="active"?"Activo":"Inactivo"}`,
    dateFrom&&`Desde: ${dateFrom}`,
    dateTo&&`Hasta: ${dateTo}`,
  ].filter(Boolean);
  const clearFilters=()=>{setSearch("");setCat("all");setBrand("all");setStatus("all");setDateFrom("");setDateTo("");};

  return (
    <div className="pro">
      <style>{CSS}</style>
      <div className="page-header"><h2>Productos</h2><p>Gestiona tu catálogo de productos</p></div>

      <div className="pro-toolbar">
        <div className="pro-left">
          <div className="pro-search"><MdSearch className="pro-search-ico" size={18}/><input placeholder="Buscar nombre, marca…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="pro-sel" value={catFilter} onChange={e=>setCat(e.target.value)}><option value="all">Todas las categorías</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <select className="pro-sel" value={brandFilter} onChange={e=>setBrand(e.target.value)}><option value="all">Todas las marcas</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select>
          <select className="pro-sel" value={statusFilter} onChange={e=>setStatus(e.target.value)}><option value="all">Todos los estados</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select>
          <div className="pro-date-row">
            <MdDateRange size={16} style={{color:"#718096",flexShrink:0}}/>
            <span className="pro-date-label">Desde</span>
            <input type="date" className="pro-date-input" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/>
            <span className="pro-date-sep">→</span>
            <span className="pro-date-label">Hasta</span>
            <input type="date" className="pro-date-input" value={dateTo} onChange={e=>setDateTo(e.target.value)}/>
            {hasDateFilter&&<button className="pro-date-clear" onClick={()=>{setDateFrom("");setDateTo("");}}>✕ Limpiar</button>}
          </div>
          {hasActiveFilters&&<button className="pro-btn pro-btn-ghost" onClick={clearFilters}>Limpiar filtros</button>}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="pro-btn pro-btn-ghost" onClick={fetchProducts}><MdRefresh size={18} className={loading?"spinning":""}/></button>
          <button className="pro-btn pro-btn-export" onClick={handleExportPreview}><MdFileDownload size={18}/> Exportar</button>
          <button className="pro-btn pro-btn-import" onClick={()=>fileRef.current?.click()}><MdFileUpload size={18}/> Importar</button>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>{handleFileRead(e.target.files[0]);e.target.value="";}}/>
          <button className="pro-btn pro-btn-primary" onClick={openCreate}><MdAdd size={18}/> Nuevo producto</button>
        </div>
      </div>

      {hasDateFilter&&(
        <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:8,fontSize:".82rem",color:"#2b6cb0"}}>
          <MdDateRange size={15}/>
          Filtrando: {dateFrom&&<strong>{dateFrom}</strong>}{dateFrom&&dateTo&&" → "}{dateTo&&<strong>{dateTo}</strong>}
          {" — "}<strong>{filtered.length}</strong> producto{filtered.length!==1?"s":""}
        </div>
      )}

      <div className="pro-table-wrap">
        {loading?(<div className="pro-empty">Cargando productos…</div>
        ):filtered.length===0?(<div className="pro-empty"><MdInventory size={40} style={{display:"block",margin:"0 auto 12px",color:"#cbd5e0"}}/><p>No se encontraron productos</p></div>
        ):(
          <>
            <table className="pro-table">
              <thead><tr><th>Imagen</th><th>Nombre / Marca</th><th>Categoría</th><th>Tallas</th><th>Colores</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id}>
                    <td><img src={p.imagen||"https://placehold.co/46x46/edf2f7/a0aec0?text=📦"} alt={p.nombre} className="pro-img" onError={e=>{e.target.src="https://placehold.co/46x46/edf2f7/a0aec0?text=📦";}}/></td>
                    <td><div className="pro-name">{p.nombre}</div>{p.marca&&<div className="pro-brand">{p.marca}</div>}{p.descripcion&&<div className="pro-desc">{p.descripcion.substring(0,55)}{p.descripcion.length>55?"…":""}</div>}</td>
                    <td><span className="pro-tag">{p.categoria||"—"}</span></td>
                    <td><TallaChips value={p.talla}/></td>
                    <td><ColorDots value={p.colores}/></td>
                    <td><span className="pro-price">{fmt(p.precio)}</span></td>
                    <td><span className={`pro-status ${p.activo?"pro-status-on":"pro-status-off"}`}>{p.activo?"Activo":"Inactivo"}</span></td>
                    <td><div className="pro-actions"><button className="pro-act pro-act-edit" onClick={()=>openEdit(p)}><MdEdit size={14}/> Editar</button><button className="pro-act pro-act-delete" onClick={()=>handleDelete(p.id,p.nombre)}><MdDelete size={14}/> {p.activo?"Desactivar":"Eliminar"}</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pro-foot">{filtered.length} producto{filtered.length!==1?"s":""}</div>
          </>
        )}
      </div>

      {/* Export */}
      {showExport&&(
        <div className="pro-overlay" onClick={e=>{if(e.target.classList.contains("pro-overlay"))setShowExport(false);}}>
          <div className="pro-modal pro-modal-lg">
            <div className="pro-mhead"><h3>Previsualizar exportación</h3><button className="pro-mclose" onClick={()=>setShowExport(false)}><MdClose/></button></div>
            <div className="pro-mbody">
              <div className="pro-export-stats">
                <span className="pro-export-stat total">📦 {exportData.length} productos</span>
                {warnFields.length===0?<span className="pro-export-stat ok">✅ Sin campos vacíos</span>:<span className="pro-export-stat warn">⚠ {warnFields.length} campo(s) vacíos</span>}
              </div>
              {exportFilters.length>0&&<div className="pro-info-box"><strong>Exportando con:</strong> {exportFilters.join(" · ")}</div>}
              {warnFields.length>0&&(<div className="pro-warn-box"><div style={{fontWeight:700,marginBottom:6,display:"flex",gap:6,alignItems:"center"}}><MdWarning/> Campos vacíos</div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>{warnFields.map(f=><span key={f} style={{background:"#fef5e7",border:"1px solid #f6e05e",borderRadius:6,padding:"2px 10px",fontSize:".8rem",fontWeight:700,color:"#975a16"}}>{IMPORTANT_FIELDS[f]}: {emptyFields[f]}</span>)}</div></div>)}
              <div className="pro-export-table-wrap">
                <table className="pro-export-table">
                  <thead><tr><th>#</th><th>Nombre</th><th>Marca</th><th>Categoría</th><th>Precio</th><th>Tallas</th><th>Colores</th><th>Estado</th></tr></thead>
                  <tbody>{exportData.map((p,idx)=>{const hasEmpty=warnFields.some(f=>!p[f]&&p[f]!==0);return(<tr key={p.id} className={hasEmpty?"pro-cell-warn":""}><td style={{color:"#a0aec0",fontSize:".75rem"}}>{idx+1}</td><td style={{fontWeight:600,color:"#1e3a5f"}}>{p.nombre||<span className="pro-cell-empty">vacío</span>}</td><td>{p.marca||<span className="pro-cell-empty">—</span>}</td><td>{p.categoria?<span className="pro-tag">{p.categoria}</span>:<span className="pro-cell-empty">—</span>}</td><td style={{color:"#38a169",fontWeight:700}}>{p.precio?fmt(p.precio):<span className="pro-cell-empty">—</span>}</td><td>{p.talla||<span className="pro-cell-empty">—</span>}</td><td>{p.colores||<span className="pro-cell-empty">—</span>}</td><td><span className={`pro-status ${p.activo?"pro-status-on":"pro-status-off"}`}>{p.activo?"Activo":"Inactivo"}</span></td></tr>);})}</tbody>
                </table>
              </div>
            </div>
            <div className="pro-mfoot"><button className="pro-btn pro-btn-ghost" onClick={()=>setShowExport(false)}>Cancelar</button><button className="pro-btn pro-btn-export" onClick={handleExportConfirm}><MdFileDownload size={16}/> Descargar CSV ({exportData.length})</button></div>
          </div>
        </div>
      )}

      {/* Crear / Editar */}
      {showModal&&(
        <div className="pro-overlay" onClick={e=>{if(e.target.classList.contains("pro-overlay"))closeModal();}}>
          <div className="pro-modal">
            <div className="pro-mhead">
              <h3>{editing?`Editar: ${editing.nombre}`:"Nuevo producto"}</h3>
              <button className="pro-mclose" onClick={closeModal}><MdClose/></button>
            </div>
            <div className="pro-mbody">
              {formErr&&<div className="pro-err">⚠ {formErr}</div>}

              <div className="pro-section-divider">Imagen principal</div>
              <ImageUploader value={form.imagen} onChange={url=>setForm(f=>({...f,imagen:url}))}/>

              <div className="pro-section-divider">Más ángulos del producto</div>
              <ImageGallery productId={savedId} onMainChange={url=>{if(url)setForm(f=>({...f,imagen:url}));}}/>

              <div className="pro-section-divider">Información básica</div>
              <div className="pro-row">
                <div className="pro-field"><label>Nombre *</label><input placeholder="Ej. Air Max 270" value={form.nombre} onChange={set("nombre")}/></div>
                <div className="pro-field"><label>Marca</label><input placeholder="Ej. Nike" value={form.marca} onChange={set("marca")} list="brand-list"/><datalist id="brand-list">{brands.map(b=><option key={b} value={b}/>)}</datalist></div>
              </div>
              <div className="pro-field"><label>Descripción</label><textarea placeholder="Descripción del producto…" value={form.descripcion} onChange={set("descripcion")}/></div>
              <div className="pro-field">
                <label>Especificaciones del producto</label>
                <textarea placeholder={"Material: Poliéster reciclado\nCuidados: Lavar a mano con agua fría\nUso recomendado: Entrenamiento"} value={form.especificaciones} onChange={set("especificaciones")}/>
                <span className="pro-field-hint">Una por línea, con el formato “Campo: detalle”. Puedes agregar material, cuidados, composición, medidas y más.</span>
              </div>
              <div className="pro-row">
                <div className="pro-field"><label>Precio (MXN) *</label><input type="number" min="0" step="0.01" placeholder="0.00" value={form.precio} onChange={set("precio")}/></div>
                <div className="pro-field"><label>Categoría</label><input placeholder="Ej. Calzado" value={form.categoria} onChange={set("categoria")} list="cat-list"/><datalist id="cat-list">{categories.map(c=><option key={c} value={c}/>)}</datalist></div>
              </div>

              <div className="pro-section-divider">Variantes</div>
              <div className="pro-field">
                <label>Tallas</label>
                <input placeholder="Ej. XS, S, M, L, XL" value={form.talla} onChange={set("talla")}/>
                <span className="pro-field-hint">Separa con comas</span>
                {tallasPreview.length>0&&<div className="pro-chips-preview">{tallasPreview.map(t=><span key={t} className="pro-chip-preview">{t}</span>)}</div>}
              </div>
              <div className="pro-field">
                <label>Colores</label>
                <input placeholder="Ej. Negro, Blanco, Rojo" value={form.colores} onChange={set("colores")}/>
                <span className="pro-field-hint">Separa con comas</span>
                {coloresPreview.length>0&&(<div className="pro-chips-preview" style={{alignItems:"center"}}>{coloresPreview.map(c=>{const hex=COLOR_MAP[c.toLowerCase()];return hex?<span key={c} className="pro-color-dot" style={{background:hex,width:18,height:18}} title={c}/>:<span key={c} className="pro-chip-preview">{c}</span>;})}</div>)}
              </div>

              <div className="pro-section-divider">Estado</div>
              <div className="pro-field">
                <div className="pro-toggle-row">
                  <button className={`pro-toggle ${form.activo===1?"on":""}`} onClick={()=>setForm(f=>({...f,activo:1}))}><MdCheckCircle size={16}/> Activo</button>
                  <button className={`pro-toggle ${form.activo===0?"off":""}`} onClick={()=>setForm(f=>({...f,activo:0}))}><MdClose size={16}/> Inactivo</button>
                </div>
              </div>
            </div>
            <div className="pro-mfoot">
              <button className="pro-btn pro-btn-ghost" onClick={closeModal} disabled={saving}>Cancelar</button>
              <button className="pro-btn pro-btn-primary" onClick={handleSave} disabled={saving}>
                {saving?<><MdRefresh size={16} className="spinning"/> Guardando…</>:<><MdCheckCircle size={16}/> {editing?"Guardar cambios":"Crear producto"}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import */}
      {showImport&&(
        <div className="pro-overlay" onClick={e=>{if(e.target.classList.contains("pro-overlay")){setShowImport(false);setImportRows([]);}}}>
          <div className="pro-modal pro-modal-sm">
            <div className="pro-mhead"><h3>Importar desde CSV</h3><button className="pro-mclose" onClick={()=>{setShowImport(false);setImportRows([]);}}><MdClose/></button></div>
            <div className="pro-mbody">
              <div className="pro-import-summary"><span className="pro-import-badge new">✓ {importRows.length-importDups.length} nuevos</span>{importDups.length>0&&<span className="pro-import-badge dup">⚠ {importDups.length} duplicados</span>}</div>
              {importDups.length>0&&(<div className="pro-warn-box"><div style={{fontWeight:700,marginBottom:6,display:"flex",gap:6,alignItems:"center"}}><MdWarning/> {importDups.length} ya existen</div><div style={{marginBottom:10,fontSize:".82rem"}}>{importDups.slice(0,3).map(d=><span key={d.nombre} style={{display:"block"}}>• {d.nombre}</span>)}{importDups.length>3&&<span>…y {importDups.length-3} más</span>}</div><div style={{display:"flex",gap:8}}><button className="pro-btn pro-btn-ghost" style={{flex:1,fontSize:".82rem",padding:"8px 10px",borderColor:dupAction==="skip"?"#1e3a5f":"#e2e8f0",background:dupAction==="skip"?"#ebf8ff":"#f7fafc"}} onClick={()=>setDupAction("skip")}>Ignorar</button><button className="pro-btn pro-btn-ghost" style={{flex:1,fontSize:".82rem",padding:"8px 10px",borderColor:dupAction==="update"?"#1e3a5f":"#e2e8f0",background:dupAction==="update"?"#ebf8ff":"#f7fafc"}} onClick={()=>setDupAction("update")}>Actualizar</button></div></div>)}
              <div className="pro-import-preview"><table><thead><tr><th>Nombre</th><th>Marca</th><th>Precio</th><th>Categoría</th></tr></thead><tbody>{importRows.slice(0,8).map((r,i)=>(<tr key={i} style={importDups.find(d=>d.nombre===r.nombre)?{background:"#fffbeb"}:{}}><td>{r.nombre}</td><td>{r.marca||"—"}</td><td>{r.precio||"—"}</td><td>{r.categoria||"—"}</td></tr>))}{importRows.length>8&&<tr><td colSpan={4} style={{color:"#a0aec0",textAlign:"center"}}>…y {importRows.length-8} más</td></tr>}</tbody></table></div>
              <div className="pro-info-box"><strong>💡 Tip:</strong> Descarga la <button onClick={handleExportTemplate} style={{background:"none",border:"none",color:"#2b6cb0",fontWeight:700,cursor:"pointer",padding:0,textDecoration:"underline"}}>plantilla CSV</button>.</div>
            </div>
            <div className="pro-mfoot"><button className="pro-btn pro-btn-ghost" onClick={()=>{setShowImport(false);setImportRows([]);}}>Cancelar</button><button className="pro-btn pro-btn-primary" onClick={handleImportConfirm} disabled={importing||(importDups.length>0&&!dupAction)}>{importing?<><MdRefresh size={16} className="spinning"/> Importando…</>:<><MdCheckCircle size={16}/> Confirmar</>}</button></div>
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary&&importResult&&(
        <div className="pro-overlay" onClick={e=>{if(e.target.classList.contains("pro-overlay"))setShowSummary(false);}}>
          <div className="pro-modal pro-modal-sm">
            <div className="pro-mhead"><h3>✅ Importación completada</h3><button className="pro-mclose" onClick={()=>setShowSummary(false)}><MdClose/></button></div>
            <div className="pro-mbody">
              <div className="pro-success-box">Se procesaron <strong>{importResult.total}</strong> fila{importResult.total!==1?"s":""}.</div>
              <div className="pro-summary-grid">
                <div className="pro-summary-card created"><span className="pro-summary-num created">{importResult.created}</span><span className="pro-summary-label">🆕 Creados</span></div>
                <div className="pro-summary-card updated"><span className="pro-summary-num updated">{importResult.updated}</span><span className="pro-summary-label">✏️ Actualizados</span></div>
                <div className="pro-summary-card skipped"><span className="pro-summary-num skipped">{importResult.skipped}</span><span className="pro-summary-label">⏭ Omitidos</span></div>
                <div className="pro-summary-card errors"><span className="pro-summary-num errors">{importResult.errors}</span><span className="pro-summary-label">❌ Errores</span></div>
              </div>
              {importResult.errors>0&&<div className="pro-warn-box"><strong>⚠ {importResult.errors} fila(s) no importadas.</strong></div>}
            </div>
            <div className="pro-mfoot"><button className="pro-btn pro-btn-primary" onClick={()=>setShowSummary(false)}><MdCheckCircle size={16}/> Cerrar</button></div>
          </div>
        </div>
      )}

      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop}
        style={{position:"fixed",inset:0,zIndex:dragOver?3999:-1,background:dragOver?"rgba(49,130,206,.12)":"transparent",border:dragOver?"3px dashed #3182ce":"none",pointerEvents:dragOver?"all":"none",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
        {dragOver&&<div style={{background:"white",padding:"24px 40px",borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,.2)",fontSize:"1.1rem",fontWeight:700,color:"#2b6cb0"}}>📂 Suelta el CSV aquí</div>}
      </div>

      {toast&&<div className={`pro-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
