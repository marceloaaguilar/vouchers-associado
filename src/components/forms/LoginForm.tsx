"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { FormProps } from "@/lib/interfaces";
import { sendRequest } from "@/lib/sendRequest";
import DialogMessage from "../dialogs/Dialog";
import setCookies from "../CookiesManagement"
import { TicketPercent } from "lucide-react";
import { useEffect } from "react"


export default function LoginForm(props:FormProps) {

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [cpfLogin, setCpfLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {

    setShowDialog(false);

    if (cpfLogin && password) {
      setIsLoading(true);
      const response = await sendRequest({data: {cpf: cpfLogin.replace(/\D/g, ""), password: password}, endpoint: "/auth/member/login", method: "POST"});
      if (response.error) {
        setShowDialog(true);
        setIsLoading(false);
        setTitleDialog(response.message);
        return;
      }

      if (response.headers && response.data && response.data.user) {
        await setCookies({name:"token", value: response.headers["access-token"]});
        await setCookies({name:"userName", value: response.data.user.name});
        await setCookies({name:"partner", value: (response.data.user.client && response.data.user.client.fantasyName)});
        window.location.href = "/";
      }

    }
  }

  const formatCPF = (cpf:string) => {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return cpf;
  };

  const handleShowFormFirstAccess = () => {
    if (props.onChange) {
      props.onChange(true);
    }
   
  }

  const handleShowDialog = () => {
    setShowDialog(false);
  }

  useEffect(() => {
    const formattedCpf = formatCPF(cpfLogin);
    setCpfLogin(formattedCpf);
  }, [cpfLogin]);

  return (
    <>
      {
        props.show? (
          <Card className="w-[350px] min-h-[250px] flex flex-col justify-center items-center">
            {!isLoading?
              <>
                <div className="flex justify-center flex-col w-full">
                  <TicketPercent className="self-center" color="#881ded" size={128}/>
                  <span className="text-center text-2xl font-bold text-[#881ded]">Área do associado</span>

                </div>

                <CardHeader className="w-full">
                  <CardTitle>Acessar</CardTitle>
                </CardHeader>
          
                <CardContent className="w-full">
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" maxLength={14} value={cpfLogin} onChange={(e) => setCpfLogin(e.target.value)} placeholder="Seu CPF" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="senha">Senha</Label>
                        <Input id="senha" value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="Sua senha" />
                      </div>
                    </div>
                  </form>
                </CardContent>
          
                <CardFooter className="flex justify-between w-full">
                  <Button className="bg-[#881DED] text-white font-bold py-2 px-4 rounded  hover:border hover:bg-transparent hover:border-[#881DED] hover:text-[#881DED]" onClick={handleLogin}>Acessar</Button>
                  <Button className="bg-transparent border border-[#881DED] text-[#881DED] hover:text-white hover:bg-[#881DED]" onClick={handleShowFormFirstAccess}>Primeiro Acesso</Button>
                </CardFooter>
              </> : 
              <div> 

                <svg aria-hidden="true" role="status" 
                  className="inline w-full h-10 mb-4  text-[#d3d3d3] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#881DED"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>

                <p>Carregando...</p>
              </div>
            }

      
          </Card>

        ) : ""
      }
      <DialogMessage show={showDialog} title={titleDialog} onChange={() => handleShowDialog()}/>
    </>
  )
}