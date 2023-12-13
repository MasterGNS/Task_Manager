import { useAuth } from "./Context";


function DeleteUser({goToHome}){
    const {username, token} = useAuth();

    const DeleteFetch = async () =>{
        try{
            const url = `http://127.0.0.1:5000/home/delete/${username}`;
            const responseOptions ={
                method: "DELETE",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username:username}), 
            };
            const response = await fetch(url, responseOptions);
            
            const data = response.json();   
            goToHome();
            console.log(data);
        }catch(e){
            console.log(e.message);
        };
    }


    const handleDeleteUserButton = () => {
        DeleteFetch();
    };

    return(
        <div>
            <button onClick={handleDeleteUserButton}>Удалить аккаунт</button>
        </div>
    )
};

export default DeleteUser