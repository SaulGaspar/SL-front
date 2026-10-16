import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeSlider.css";

import ropaImage from "url:../assets/home/sportlike-ropa.png";
import accesoriosImage from "url:../assets/home/sportlike-accesorios.png";
import deportesImage from "url:../assets/home/sportlike-deportes.png";

const slides = [
  { image:ropaImage, alt:"SportLike con atleta sobre fondo negro y azul", category:"Ropa", text:"Viste tu próxima meta.", link:"/catalogo?categoria=Ropa" },
  { image:accesoriosImage, alt:"SportLike con deportista sobre fondo negro y violeta", category:"Accesorios", text:"Pequeños detalles. Grandes retos.", link:"/catalogo?categoria=Accesorios" },
  { image:deportesImage, alt:"SportLike: fútbol, básquetbol, tenis, natación y más deportes", category:"Tu deporte", text:"Tu pasión. Tu equipo. SportLike.", link:"/catalogo" },
];

export default function HomeSlider() {
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState(document.hidden);
  const touchStart = useRef(null);
  const slide = slides[active];
  const move = delta => setActive(index=>(index+delta+slides.length)%slides.length);
  useEffect(()=>{
    const changeVisibility=()=>setHidden(document.hidden);
    document.addEventListener("visibilitychange",changeVisibility);
    return ()=>document.removeEventListener("visibilitychange",changeVisibility);
  },[]);
  useEffect(()=>{
    if(hidden)return;
    const timer=setInterval(()=>setActive(index=>(index+1)%slides.length),3000);
    return ()=>clearInterval(timer);
  },[hidden,active]);

  return <section className="sl-home-slider" aria-label="Descubre SportLike" aria-roledescription="carrusel">
    <div className="sl-container">
      <div className={`sl-home-slide${active === 2 ? " sl-home-slide--sports" : ""}`} onTouchStart={event=>{const touch=event.touches[0];touchStart.current={x:touch.clientX,y:touch.clientY};}}
        onTouchCancel={()=>{touchStart.current=null;}}
        onTouchEnd={event=>{const start=touchStart.current;touchStart.current=null;if(!start)return;const touch=event.changedTouches[0];const dx=touch.clientX-start.x,dy=touch.clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);}}>
        <Link className="sl-home-slide-art" to={slide.link} aria-label={`Explorar ${slide.category.toLowerCase()}`}>
          <span className="sl-home-slide-visual"><img src={slide.image} alt={slide.alt} loading="eager" decoding="async"/></span>
          <span className="sl-home-slide-copy"><span className="sl-home-slide-category">{slide.category}</span><span className="sl-home-slide-tagline">{slide.text}</span><span className="sl-home-slide-cta">Explorar <i className="bi bi-arrow-up-right" aria-hidden="true"/></span></span>
        </Link>
      </div>
    </div>
  </section>;
}
