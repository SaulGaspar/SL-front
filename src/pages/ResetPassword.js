import React, {useState} from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function ResetPassword(){
  const [params] = useSearchParams();
  const [pass,setPass]=useState('');
  const [msg,setMsg]=useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      await axios.post((process.env.REACT_APP_API_URL||'http://localhost:5000') + '/api/reset-password',{ token: params.get('token'), password: pass });
      setMsg('Contraseña restablecida');
      setTimeout(()=>navigate('/login'),1500);
    }catch(e){
      setMsg(e.response?.data?.error || 'Error');
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Restablecer contraseña</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-2"><label>Nueva contraseña</label><input className="form-control" value={pass} onChange={e=>setPass(e.target.value)} /></div>
        <button className="btn btn-primary-custom w-100">Restablecer</button>
      </form>
    </div>
  );
}
