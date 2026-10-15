import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import FavoriteButton from "../../components/FavoriteButton";
import Feedback from "../../components/Feedback";
import fallback from "../../assets/PLAYERA.jpg";
import "../../styles/account.css";
export default function Favoritos(){
  const {favorites,error}=useFavorites();
  return <main className="ac-page"><div className="ac-wrap"><nav className="ac-breadcrumb"><Link to="/profile">Mi cuenta</Link><span>/ Favoritos</span></nav><header className="ac-hero"><div><span className="ac-eyebrow">Tus productos guardados</span><h1>Favoritos</h1><p>Se guardan en este navegador. Consulta cada producto para confirmar su precio y disponibilidad.</p></div></header>{error && <Feedback kind="error" title={error}/>}<div className="sl-favorites-grid">{favorites.map(product=><article className="ac-card" key={product.id}><Link to={`/producto/${product.id}`}><img src={product.imagen || fallback} alt={product.nombre} onError={event=>{if(event.currentTarget.src!==fallback)event.currentTarget.src=fallback;}}/><h2>{product.nombre}</h2></Link><FavoriteButton product={product}/></article>)}</div>{!favorites.length && <Feedback title="Aún no tienes favoritos">Guarda productos usando el corazón en el <Link to="/catalogo">catálogo</Link>.</Feedback>}</div></main>;
}
