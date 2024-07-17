import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.sass'
import { BusAlert } from '@mui/icons-material';

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState(''); // состояние для хранения значения логина
  const [password, setPassword] = useState(''); // состояние для хранения значения пароля
  const navigate = useNavigate();

  const handleLogin = async () => { // функция для авторизации
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
      console.log(localStorage.getItem('authToken')); // вывод токена в консоль
      navigate('/home');
      
    } catch (error) {
      console.error('Ошибка авторизации:', error); // вывод ошибки авторизации в консоль
      alert('Неверный логин или пароль'); // вывод предупреждения о неверной авторизации
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.form}>
            <Typography className={styles.title} component="h1" variant="h5">Авторизация</Typography>
            <TextField label="Логин" value={username} onChange={(e) => setUsername(e.target.value)} /> {/* поле ввода логина */}
            <TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* поле ввода пароля */}
            <Button variant="contained" onClick={handleLogin}>Войти</Button> {/* кнопка "Войти" */}
        </div>
    </div>
  );
};

export default AuthForm;


