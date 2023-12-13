import React,{ useState } from 'react';

function RegistrationForm({toReg}){
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        };
    
        fetch('http://127.0.0.1:5000/registration', requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Обработка успешного ответа от сервера
            console.log('Регистрация прошла успешно:', data);
            toReg();
          })
          .catch((error) => {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
          });
      };
    return (
        <form onSubmit={handleSubmit}>
          <div>
            <input  className='EnterForm'
              type="text"
              placeholder="Имя пользователя"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input className='EnterForm'
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input className='EnterForm'
              type="text"
              placeholder="Имя"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input className='EnterForm'
              type="password"
              placeholder="Пароль"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button className='EnterButton' type="submit">Зарегистрироваться</button>
        </form>
      );
  
}
export default RegistrationForm;