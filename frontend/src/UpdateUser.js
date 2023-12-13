import React, {useState} from 'react';
import {useAuth} from './Context'

function UpdateUser({onClick}){
    const {username, token} = useAuth();
    const[formUpdate,setFormUpdate] = useState({
        username: '',
        email: '',
        password: '',
        name: ''
    });

    const handleUpdateUser = (e) => {
        const { name, value } = e.target;
        setFormUpdate({
          ...formUpdate,
          [name]: value,
        });
      };

    const handleUpdateUserSubmit = async (e)=>{
        e.preventDefault();
        
        try{
        const url = `http://127.0.0.1:5000/home/update/${username}`;
        const requestOptions =   {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formUpdate),
       }; 
       console.log(requestOptions.body);
       const response = await fetch(url, requestOptions);
       if(!response.ok){
        console.error(`Error: ${response.status} - ${response.statusText}`);
        throw new Error(response.message);      
        };

       const data = await response.json();
       console.log(data);
       onClick();

    } catch(error){
        console.log(error.message);
    };
    
};

    return(
        <form onSubmit={handleUpdateUserSubmit}>
        <div>
            <input
            type="text"
            placeholder="Имя пользователя"
            id="username"
            name="username"
            value={formUpdate.username}
            onChange={handleUpdateUser}
            />
        </div>
        <div>
            <input
            type="text"
            placeholder="Пароль"
            id="password"
            name="password"
            value={formUpdate.password}
            onChange={handleUpdateUser}
            />
        </div>
        <div>
            <input
            type="text"
            placeholder="Email"
            id="email"
            name="email"
            value={formUpdate.email}
            onChange={handleUpdateUser}
            />
        </div>
        <div>
            <input
            type="text"
            placeholder="Имя"
            id="name"
            name="name"
            value={formUpdate.name}
            onChange={handleUpdateUser}
            />
        </div>
        <button onClick={handleUpdateUserSubmit}>Обновить</button>
    </form>
    )
};

export default UpdateUser;