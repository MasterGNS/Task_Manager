import { useState } from "react";
import { useAuth } from "./Context";

const UpdateTaskComponent = ({ oldTask, oldTaskType, oldDate, onClick, toGet}) => {
    const [newTask, setNewTask] = useState('');
    const [newTaskType, setNewTaskType] = useState('');
    const [newDate, setNewDate] = useState('');
    const {username, token} = useAuth();

    const handleUpdate = async () => {
      // Проверяем, были ли заполнены поля, и присваиваем значения из old_ при необходимости
      const updatedTask = {
        old_task: oldTask,
        old_task_type: oldTaskType,
        old_date: oldDate,
        new_task: newTask || oldTask,
        new_task_type: newTaskType || oldTaskType,
        new_date: newDate || oldDate,
      };
      console.log(updatedTask);
      
      try {
        const url = `http://127.0.0.1:5000/home/tasks/${username}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedTask)
        };        
        console.log(requestOptions.body);
        
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status},  ${errorMessage}`);
        }
        const data = await response.json();
        console.log(data);
        
        // Очищаем значения полей после обновления задачи
        setNewTask('');
        setNewTaskType('');
        setNewDate('');
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
      }
      onClick();
      toGet();
    };

    
      return(<div>
        {/* Поля для ввода новых значений */}

        <label>Новая задача: </label>
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
  
        <label>Новый тип задачи: </label>
        <input type="text" value={newTaskType} onChange={(e) => setNewTaskType(e.target.value)} />
  
        <label>Новая дата: </label>
        <input type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
  
        {/* Кнопка для обновления задачи */}
        <button onClick={handleUpdate}>Обновить</button>
      </div>);
  };
  

  export default UpdateTaskComponent;