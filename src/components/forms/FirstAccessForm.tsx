import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { sendRequest } from "@/lib/sendRequest";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProps } from "@/lib/interfaces";



export default function FirstAccessForm(props:FormProps) {

  const [cpfPasswordRequest, setCpfPasswordRequest] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handlePasswordRequest = async () => {

    if (cpfPasswordRequest) {
      setIsLoading(true);
      const response = await sendRequest({data: {cpf: cpfPasswordRequest}, endpoint: "/auth/member/request-reset-password", method: "POST"});
      if (response.error){
        console.log("Erro: " + response.error);
        return;
      }

      setIsLoading(false);
      if (props.onChange) props.onChange(true);
      if (props.dataOnChange) props.dataOnChange(cpfPasswordRequest);
    }
  }

  const handleBackForm = () => {
    if (props.back) {
      props.back(true);
    };
  }

  return (
    props.show?(
      <Card className="w-[350px] min-h-[250px] items-center flex flex-col justify-center">
        {!isLoading? 
          <>
            <CardHeader className="w-full">
              <CardTitle>Primeiro acesso</CardTitle>
              <CardDescription>Solicite sua nova senha</CardDescription>
            </CardHeader>

            <CardContent className="w-full">
              <form>
                <>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" maxLength={14} value={cpfPasswordRequest} onChange={(e) => setCpfPasswordRequest(e.target.value)} placeholder="Seu CPF" />
                </>
              </form>
            </CardContent>

            <CardFooter className="flex justify-between w-full">
              <Button className="bg-[#881DED] text-white font-bold py-2 px-4 rounded  hover:border hover:bg-transparent hover:border-[#881DED] hover:text-[#881DED]" onClick={handlePasswordRequest}>Solicitar</Button>
              <Button className="bg-transparent border border-[#881DED] text-[#881DED] hover:text-white hover:bg-[#881DED]" onClick={handleBackForm}>Voltar</Button>
            </CardFooter>
          </>
        : <p>Carregando...</p>}
      </Card> 
    ) : ""
  )
}