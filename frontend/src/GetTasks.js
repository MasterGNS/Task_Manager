import React, {useState, useEffect, useCallback} from "react";
import DeleteButton from "./DeleteTask";
import UpdateTaskComponent from "./UpdateTask";
import { useAuth } from "./Context";
import AddTask from "./AddTask";
import Modal from "react-modal";


import "./LoggedUserForm.css"; 
import "./Table.css";

function GetTasks() {
    const [tasks, setTasks] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const { username, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    
    
    const handleEditModal = () => {
      setUpdateModalOpen(!isUpdateModalOpen);
    };

    const handleUpdateModal = () => {
      setModalOpen(!isModalOpen);
      setIsAddTask(!isAddTask); 
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleGet = useCallback( async () => {
        try {
          const url = `http://127.0.0.1:5000/home/tasks/${username}`;
          const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    
          if (!response.ok) {
            throw new Error(`Http error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log(data);
          setTasks(data);
        } catch (error) {
          console.log(error.message);
        }
      }, [username, token])

      useEffect(() => {
        handleGet();
      },[handleGet]);

    useEffect(() => {
      if (showTasks && tasks && tasks.message) {
        setShowTasks(false);
      } else if (tasks.length > 0) {
        setShowTasks(true);
      }
      else if(tasks.length < 0) setShowTasks(false);
    }, [tasks, showTasks]);

    const[isAddTask, setIsAddTask] = useState(false);

    const handleAddTask = () =>{
        setIsAddTask(!isAddTask);
    };
  
    const TaskListComponent = () => (
      <div className="getedtasks">
        <h2>Task List</h2>
        {Array.isArray(tasks) ? (
          <table>
            <thead>
              <tr>
                <th>Задача</th>
                <th>Тип задачи</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item) => (
                item.task && item.task_type && item.date ? (
                  <tr key={item.task}>
                    <td>{item.task}</td>
                    <td>{item.task_type}</td>
                    <td>{item.date}</td>
                    <td>
                        <button className="buttonUpdate" onClick={() =>{handleEdit(); handleEditModal()}}></button>
                        <Modal
                        isOpen={isUpdateModalOpen}
                        onRequestClose={handleEditModal}
                        className={`modal-edit ${isUpdateModalOpen ? 'modal-menu' : ''}`}
                        overlayClassName="overlay"
                        >
                          <UpdateTaskComponent
                          onClick={handleEdit}
                          toGet={handleGet}
                          oldTask={item.task}
                          oldTaskType={item.task_type}
                          oldDate={item.date}
                        />
                        </Modal>
 
                      <DeleteButton
                        toGet={handleGet}
                        task={item.task}
                        task_type={item.task_type}
                        date={item.date}
                      />
                    </td>
                  </tr>
                ) : null
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
    
    return (
      <div>
        {showTasks ? <TaskListComponent/> : 
        <div className="container">
        <h2>
          {tasks?.message}<p/>Создайте новую задачу
        </h2>
        </div>}
        {isAddTask &&(
          <Modal
          isOpen={isModalOpen}
          onRequestClose={() => handleUpdateModal}
          className={`modal-add ${isModalOpen ? 'modal-menu' : ''}`}
          overlayClassName="overlay"
          >
        <AddTask onAddTask ={handleAddTask} toGet = {handleGet}/> 
        </Modal>)}
        <button className = 'top-bar AddTask'onClick={() => {handleAddTask(); setModalOpen(true)}}>Добавить задачу</button>
      </div>
    );
  }
  
  export default GetTasks;
  