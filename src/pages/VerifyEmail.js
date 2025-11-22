import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    const token = params.get('token');
    if(token){
      axios.get('https://sl-back.vercel.app/api/verify-email?token='+token)
        .then(()=>setMsg('Correo verificado. Ya puedes iniciar sesión.'))
        .catch(()=>setMsg('Token inválido o expirado'));
    }
  }, []);

  return (
    <div>
      <h3>Verificar correo</h3>
      <p>{msg}</p>
    </div>
  );
}
