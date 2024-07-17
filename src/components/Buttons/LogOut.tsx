import React from 'react'
import { useNavigate } from 'react-router-dom';

function LogOut() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // удаление токена из localStorage
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default LogOut

