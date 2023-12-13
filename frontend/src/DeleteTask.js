import { useAuth } from "./Context";

function DeleteButton({task, task_type, date, toGet}) {
    const {username, token} = useAuth();
    const deleteTask = {
        task: task,
        task_type: task_type,
        date: date
    };


    const DeleteTask = async () => {
        console.log(deleteTask);
        const url = `http://127.0.0.1:5000/home/tasks/${username}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(deleteTask)
        };
        console.log(requestOptions.body);
        return fetch(url,requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }   
            return response.json();
        })
        .then(data => {
            console.log(data);
            toGet();
        })
        .catch(error => {
            console.error('Ошибка при удалении задачи:', error.message);
        });
        
    };
    
        const handleDelete = async () => {
        await DeleteTask(task);
        };
    
        return (
            <button className="buttonDelete" onClick={handleDelete}></button>
        );
    };


export default DeleteButton