import React, { useState } from 'react';
import { useAuth } from './Context';

function LoginForm({goToHome}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setAuthData} = useAuth();

    const fetchData = async () => {
      try {
        // Замените URL на свой
        const url = 'http://127.0.0.1:5000/login';
        const params = new URLSearchParams({
          username: username,
          password: password,
        });
  
        const response = await fetch(`${url}?${params}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setAuthData(data.acsess_token, username)
        // Выводим текстовый ответ
        console.log('Успешная авторизация',data.acsess_token, username);
        if(data.acsess_token) goToHome();
        return (data.acsess_token)
      } catch (error) {
        console.error('Ошибка авторизации', error.message);
      }
    };

    const {token} = useAuth();
    const HomeUser = async () =>{
        try{
            const url = 'http://127.0.0.1:5000/home/' + username
            const response = await fetch(url,{
                headers:
                {
                    'Authorization': `Bearer ${token}`
                }
        });
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }   
            const data = await response.json();
            console.log(data);
        } catch(error){
            console.log(error.message);
        }
    
    }
    const handleButtonClick = () => {
        fetchData();
    }

    return (
      <div>
        {/* Поля ввода */}
        <input  className='EnterForm'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br></br>
        <input className='EnterForm'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p></p>
        {/* Кнопка для отправки запроса */}
        <button className='EnterButton' onClick={handleButtonClick}>Войти</button>
  
        {/* Ваш компонент x */}
        <p></p>
      </div>
    );
    
  };
  
  
    
  export default LoginForm;