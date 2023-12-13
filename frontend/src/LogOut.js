import React from "react";
import { useAuth } from './Context';

function LogOut({goToHome}) {
    let {setAuthData} = useAuth();

    const ExitButtonClick = () => {
        goToHome();
        setAuthData(null, null);
    };

    return(
        <div>
            <button className="top-bar LogOut" onClick={ExitButtonClick}>Выйти</button>
        </div>
    )
};

export default LogOut;