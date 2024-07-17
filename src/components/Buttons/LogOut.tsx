import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function LogOut() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // удаление токена из localStorage
    navigate('/');
  };

  return (
    <div>
      <Button variant='contained' color='secondary' onClick={handleLogout}>Выйти</Button>
    </div>
  )
}

export default LogOut

