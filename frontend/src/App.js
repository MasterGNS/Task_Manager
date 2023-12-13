import React, {useState} from "react";
import {AuthProvider} from './Context';
import LogedUserForm from "./LoggedUserForm";
import EnterForm from "./EnterForm";

function App()
{
  const[showLoggedUser,setShowLoggedUser] = useState(false);

  const handleShowLogged = () => {
    setShowLoggedUser(!showLoggedUser);
  };

  return(
    <div>
    <AuthProvider>
      {showLoggedUser ? <LogedUserForm toOut = {handleShowLogged}/> : <EnterForm toEnter = {handleShowLogged}/>}
    </AuthProvider>
  </div>
  );
}

export default App;
