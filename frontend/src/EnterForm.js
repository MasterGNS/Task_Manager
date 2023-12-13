import React, {useState} from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

import "./LoginForm.css"


function EnterForm({toEnter}){
    const[showRegistration,setShowRegistration] = useState(false);

    const handleSwapForms = () => {
        setShowRegistration(!showRegistration);
      };

      return (
        <div className="login-form-container">
          {showRegistration ? (
            <RegistrationForm toReg={handleSwapForms} />
          ) : (
            <LoginForm goToHome={toEnter} />
          )}
          {!showRegistration && (
            <p>
              <a href="#" onClick={handleSwapForms}>
              У меня нет аккаунта
              </a>
            </p>
          )}
          {showRegistration && (
            <p>
              <a href="#" onClick={handleSwapForms}>
                У меня есть аккаунт
              </a>
            </p>
          )}
        </div>
      );
    }

export default EnterForm