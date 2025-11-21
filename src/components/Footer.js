import React from 'react';
export default function Footer(){
  return (
    <footer className="footer mt-4 bg-light">
      <div className="container text-center py-3">
        <p className="mb-1"><strong>SportLike</strong> - Tu tienda de artículos deportivos.</p>
        <small>© {new Date().getFullYear()} SportLike. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
