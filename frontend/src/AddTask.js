import React, {useState}from "react";
import { useAuth } from "./Context";

function AddTask({onAddTask, toGet}){

    const {username, token} = useAuth();

    const [newTask, setNewTask] = useState({
        task: '',
        task_type: '',
        date: '',
      });
    
      const handleInputChangeTask = (e) => {
        const { name, value } = e.target;
        setNewTask({
          ...newTask,
          [name]: value,
        });
      };
    
      const handleTaskAdd = (e) => {
        e.preventDefault();
        console.log(newTask);
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newTask),
        };
    
        fetch(`http://127.0.0.1:5000/home/tasks/${username}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Обработка успешного ответа от сервера
            console.log(data);
            if (typeof onAddTask === 'function') {
                onAddTask();
                toGet();
            }
          })
          .catch((error) => {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
            
          });
      };
      
    return (
        <form onSubmit={handleTaskAdd}>
          <div>
            <input
              type="text"
              placeholder="Задача"
              id="task"
              name="task"
              value={newTask.task}
              onChange={handleInputChangeTask}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Тип задачи"
              id="task_type"
              name="task_type"
              value={newTask.task_type}
              onChange={handleInputChangeTask}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Дата"
              id="date"
              name="date"
              value={newTask.date}
              onChange={handleInputChangeTask}
            />
          </div>
          <button type="submit">Добавить</button>
        </form>
      );
}

export default AddTask;