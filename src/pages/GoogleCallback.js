import React, {useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function GoogleCallback({onLogin}){
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(()=>{
    const token = params.get('token');
    if(token){
      localStorage.setItem('token', token);
      // token returned from backend is actually a JWT; we set a minimal user object
      // In a real flow backend should return user info or frontend should decode token
      localStorage.setItem('user', JSON.stringify({usuario:'google_user'}));
      onLogin && onLogin(JSON.parse(localStorage.getItem('user')));
      navigate('/');
    }else{
      navigate('/login');
    }
  },[]);
  return <div>Procesando inicio de sesión con Google...</div>;
}
