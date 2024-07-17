import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState(''); // состояние для хранения значения логина
  const [password, setPassword] = useState(''); // состояние для хранения значения пароля
  const navigate = useNavigate();

  const handleLogin = async () => {
    localStorage.removeItem('authToken'); // удаление токена из localStorage
    try {
      const response = await axios.post('https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/login', {
        username: username,
        password: password
      });
      console.log(response.data);
      const token = response.data.data.token;
      console.log(token); // извлечение токена из ответа сервера
      localStorage.setItem('authToken', token); // сохранение токена в localStorage
      console.log(localStorage.getItem('authToken'));
      navigate('/home');
    } catch (error) {
      console.error('Ошибка авторизации:', error); // вывод ошибки авторизации в консоль
    }
  };



  return (
    <div>
      <Typography variant="h5">Форма авторизации</Typography>
      <TextField label="Логин" value={username} onChange={(e) => setUsername(e.target.value)} /> {/* поле ввода логина */}
      <TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* поле ввода пароля */}
      <Button variant="contained" onClick={handleLogin}>Войти</Button> {/* кнопка "Войти" */}
    
    </div>
  );
};

export default AuthForm;

