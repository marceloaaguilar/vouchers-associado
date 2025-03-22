import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProps } from "@/lib/interfaces";
import { useState } from "react";
import DialogMessage from "../dialogs/Dialog";
import { sendRequest } from "@/lib/sendRequest";


export default function NewPasswordForm(props:FormProps) {

  const [codePasswordRequest, setCodePasswordRequest] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [impediment, setImpediment] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
 

  const handleCodePassword = async () => {

    setImpediment(false);

    if (password !== confirmPassword) {
      setTitleDialog("As senhas não coincidem!");
      if (props.onChange) props.onChange(true);
      setShowDialog(true);
      setImpediment(true);
      return;
    }

    const dataPasswordRequest = {
      cpf: props.data?.cpfLogin,
      resetPasswordCode: codePasswordRequest, 
      newPassword: password
    }

    setIsLoading(true);
    const response = await sendRequest({data: dataPasswordRequest, endpoint: "/auth/member/reset-password", method: "POST"});
    if (response.error) {
      console.log("Erro: " + response.message);
      return;
    }
    
    setIsLoading(false);
    setTitleDialog("Senha atualizada com sucesso!");
    setShowDialog(true);

  }

  const handleShowDialog = (updatedValue:boolean) => {
    if (!impediment && props.onChange){
      props.onChange(updatedValue);
    }
    setShowDialog(updatedValue);
  }

  return (
    props.show ? (
      <>
        <Card className="w-[350px] min-h-[300px] flex flex-col justify-center items-center">

          {!isLoading ? 
            <>
              <CardHeader className="w-full">
                <CardTitle>Nova senha</CardTitle>
                <CardDescription>Digite a nova senha e o código de confirmação enviado por e-mail.</CardDescription>
              </CardHeader>

              <CardContent className="w-full">

                <form>
                  <div className="grid w-full items-center gap-4">

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="code">Código</Label>
                      <Input id="code" value={codePasswordRequest} onChange={(e) => setCodePasswordRequest(e.target.value)}/>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Nova Senha</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirme a Nova senha</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>


                  </div>
                </form>

              </CardContent>

              <CardFooter className="flex justify-between w-full">
                <Button className="bg-[#881DED] text-white font-bold py-2 px-4 rounded  hover:border hover:bg-transparent hover:border-[#881DED] hover:text-[#881DED]" onClick={handleCodePassword}>Validar</Button>
              </CardFooter>
            </> : <p>Carregando...</p>}

        </Card>

        <DialogMessage 
          show={showDialog}  
          title={titleDialog}
          onChange={(updatedValue) => handleShowDialog(updatedValue)}
        />
      
      </>
  
    ) : ""
  )
}