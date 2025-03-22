import { sendRequest } from "@/lib/sendRequest";
import { useState } from "react";
import { Voucher } from "@/app/page";
import Image from "next/image";

interface ModalProps{
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | undefined;
  tokenUsr: string;
  logoPartner: string;
}

export default function ModalVoucher({ isOpen, onClose, voucher, logoPartner, tokenUsr }:ModalProps){

  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const redeemVoucher = async () => {
    if (!voucher) return;
    setVoucherCode("");
    setLoadingStatus(true);
    await sendRequest({headers: {'Authorization' : 'Bearer ' + tokenUsr} , endpoint: `/voucher/${voucher.id}/redeem`, method: 'POST'}).then((response)=> {
        
        if (response.error) {
            setErrorMessage(response.message);
            return;
        }

        setVoucherCode(response.data.voucherCode)
        setLoadingStatus(true);
        
    })
  }

  const manageOnClose = () => {
    setLoadingStatus(false);
    setVoucherCode("");
    setErrorMessage("");
    onClose();
  }

  return (
    (isOpen?(
        
      <div id="popup-modal" className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-xl h-96 max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 items-center">
             
                  <button type="button" onClick={manageOnClose} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Fechar</span>
                  </button>


                    <div className="p-4 md:p-5 text-center w-full h-full items-center">
                        {voucher?
                            <>
                                <div className="flex justify-center">
                                    <Image className="xl:w-24 h-24 object-contain md:w-96 rounded-3xl lg:bg-white" width={350} height={350} src={`https://sistema.exclusivepass.com.br/api/files/${logoPartner}`} alt="" />
                                </div>
                                <h3 className="text-3xl font-normal text-black-500 dark:text-black-400 my-2">{voucher.title}</h3>
                                <p className="mt-2 font-normal text-gray-800 dark:text-gray-800">{voucher.description}</p>

                                {voucherCode ?  (
                                    <div className="my-6">
                                        <p>Resgate seu cupom:</p>
                                        <div className="flex justify-center items-center gap-6 mt-4">
                                            <div className="border-dashed border-2 border-gray-400 px-4 py-2">
                                                <p className="font-bold text-xl text-gray-700">{voucherCode}</p>
                                            </div>
                                            <button className="px-8 py-2 rounded-3xl bg-[#881DED] text-white" onClick={() => copyVoucherToClipboard(voucherCode)}> Copiar</button>
                                        </div>
                                    </div>
                                )
                                    : errorMessage?  <p className="text-red-800 mt-6">{errorMessage} </p> : <button disabled={loadingStatus} onClick={redeemVoucher} type="button" className={` text-white font-bold mx-6 my-4 py-2 px-4 rounded ${loadingStatus? "bg-[#c188f7fa]" : "bg-[#881DED]"}`}>
                                    
                                        {loadingStatus ? 
                                            (
                                            <>
                                                <span>Resgatando Cupom</span>
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-2  text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                </svg>
                                            </>
                                            )

                                            : "Resgatar Cupom" 
                                        }

                                    </button>

                                }
                            </>
                        : <p>Carregando voucher...</p>}

                    </div>
              
            </div>
          </div>
      </div>)
    : "")
  )
}

function copyVoucherToClipboard(voucherCode:string) {
    return navigator.clipboard.writeText(voucherCode);
}