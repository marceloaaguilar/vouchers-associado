'use client';
import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import FirstAccessForm from "@/components/forms/FirstAccessForm";
import NewPasswordForm from "@/components/forms/NewPasswordForm";


export default function Login() {

  const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
  const [showFormFirstAccess, setShowFormFirstAccess] = useState<boolean>(false);
  const [showFormNewPassword, setShowFormNewPassword] = useState<boolean>(false);
  const [cpfLogin, setCpfLogin] = useState<string>("");

  const handleShowFormFirstAccess = (updatedValue:boolean) => {
    setShowLoginForm(false);
    setShowFormFirstAccess(updatedValue);
  }

  const handleShowNewPasswordForm = (updatedValue:boolean) => {
    setShowFormFirstAccess(false);
    setShowFormNewPassword(updatedValue);
  }

  const handleBackLoginForm = (updatedValue:boolean) => {
    setShowFormFirstAccess(false);
    setShowLoginForm(updatedValue);
  }
  
  const handleUpdateData = (newValue:string) => {
    setCpfLogin(newValue)
  }

  const handleShowLoginForm = (updatedValue:boolean) => {
    if (updatedValue === false) {
      setShowFormNewPassword(updatedValue);
      setShowLoginForm(true);

    }
  }

  return (
    <div className="flex justify-center h-screen items-start mt-28">

      <LoginForm 
        show={showLoginForm} 
        onChange={(updatedValue) => handleShowFormFirstAccess(updatedValue)}
      />

      <FirstAccessForm 
        show={showFormFirstAccess} 
        onChange={(updatedValue) => handleShowNewPasswordForm(updatedValue)} 
        back={(updatedValue) => handleBackLoginForm(updatedValue)}
        dataOnChange= {(newValue) => handleUpdateData(newValue)}
        data={{cpfLogin: cpfLogin}}
      />

      <NewPasswordForm show={showFormNewPassword} 
        data={{cpfLogin: cpfLogin}} 
        onChange={(updatedValue) => handleShowLoginForm(updatedValue)}
      />

            
    </div>

  );
}
