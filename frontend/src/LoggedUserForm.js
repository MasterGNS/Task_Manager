import { useState } from "react";
import {useAuth} from './Context';
import TasksForm from "./TasksForm";
import UpdateUser from "./UpdateUser";
import LogOut from "./LogOut";
import DeleteUser from "./DeleteUser"
import Modal from "react-modal";


import "./LoggedUserForm.css"

function LogedUserForm({toOut}){
    const[isUpdateUser, setUpdateUser] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleUpdateModal = () => {
        setUpdateUser(false);
        setModalOpen(!isModalOpen);
      };

    const handleUpdate = () =>{
        setUpdateUser(!isUpdateUser);
    };

    const h2style = {
        textAlign: 'center'
    };

    const {username} = useAuth();
        return(
        <div>
            <div className="top-bar">
            <h2 style={h2style}>{username}</h2>
            <button className="top-bar Menu" onClick={handleUpdateModal}>Меню</button>
            <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setModalOpen(false)}
            className={`modal-content ${isModalOpen ? 'modal-menu' : ''}`}
            overlayClassName="overlay"
            contentLabel="Menu"
            >
            {isUpdateUser ? (
            <Modal
            isOpen={isModalOpen}
            onRequestClose={() => {
                setUpdateUser(false);
                setModalOpen(false);
              }}
              className={`modal-content ${isModalOpen ? 'modal-menu' : ''}`}   
              overlayClassName="overlay"
            > 
            <UpdateUser onClick = {handleUpdate}/> 
            </Modal>) : 
            <button onClick={handleUpdate}>Изменить данные пользователя</button>}
            <DeleteUser goToHome = {toOut}/>
            </Modal>
            <LogOut goToHome = {toOut}/>
            </div>
            <div className="page-content">
            <p align = "center"><TasksForm/></p>
            </div>
        </div>
        )        
}

export default LogedUserForm