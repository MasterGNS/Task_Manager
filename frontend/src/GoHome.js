import { useAuth } from "./Context";
function GoHome(){
    const {username, token} = useAuth();
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
}


export default GoHome;