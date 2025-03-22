'use client';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { sendRequest } from "@/lib/sendRequest";
import { getCookies} from "@/components/CookiesManagement";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card"
import Image from "next/image"
import ModalVoucher from "@/components/modals/ModalVoucher";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagionation";
import SearchInput from "@/components/SearchInput";
import SelectInput from "@/components/SelectInput";
import { getLocalStorage, setLocalStorage} from "@/components/LocalStorageManagement";

export interface Voucher {
  description: string,
  id: string,
  rules: string,
  title: string,
  value: number,
  partner: Partner
}

interface VoucherProps {
  isAvailable: boolean, 
  voucher: Voucher,
  reservedBalanceInCents: number,
  waitingTimeInHours: number
}

interface Partner {
  fantasyName: string,
  id: string,
  logo: string
  image?: string | null
  category: Category
  city: City
  state: State
}

interface Category {
  id: number,
  name: string
}

interface City {
    id: number,
    name: string
}

interface State {
    id: number, 
    name: string
}
  
export default function Home() {

  const [tokenUsr, setTokenUsr] = useState<string>("");
  const [vouchersUsr, setVouchersUsr] = useState<VoucherProps[]>([]);
  const [isOpenModalVoucher, setOpenModalVoucher] = useState<boolean>(false);
  const [voucherPartnerLogo, setVoucherPartnerLogo] = useState<string>("");
  const [voucherModal, setVoucherModal] = useState<Voucher>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [skipNumber, setSkipNumber] = useState<number>(0);
  const [takeNumber] = useState<number>(4);
  const [paginedVouchers, setPaginedVouchers] = useState<VoucherProps[]>([]);

  useEffect(() => {
    defineUserToken();
  },[]);

  useEffect(()=> {
    if (tokenUsr) {
        getPaginedVouchersUser(tokenUsr, setPaginedVouchers, takeNumber, skipNumber)
    }
  },[skipNumber])

  useEffect(()=> {
    if (searchValue === "") {
      getVouchersOnCookies().then((value) => {
          if (value && Array.isArray(value)) setVouchersUsr(value as VoucherProps[]);
      })
      return
    }
    setVouchersUsr(searchVouchers(vouchersUsr, searchValue ? searchValue : "", selectedCategory ? selectedCategory: ""));

  },[searchValue])

  useEffect(()=> {
    if (tokenUsr) {
        getVouchersUser(tokenUsr, setVouchersUsr);
        getPaginedVouchersUser(tokenUsr, setPaginedVouchers, takeNumber, skipNumber);
    }
  }, [tokenUsr]);

  useEffect(()=> {
    getVouchersOnCookies().then((value) => {
      if (value && Array.isArray(value)) {
        setVouchersUsr(selectedCategory ? searchVouchers(value, "", selectedCategory): value as VoucherProps[]) 
      }
    })
    
  },[selectedCategory]);

  const defineUserToken = async () => {
    await getCookies("token").then((response)=> {
      if (response) {
        setTokenUsr(response);
      };
    });
  }

  const closeModal = () => setOpenModalVoucher(false);

  const openModalVoucher = (voucher:Voucher) => {
    setVoucherModal(undefined);
    getVoucherInfo(voucher.id);
    setVoucherPartnerLogo(voucher.partner.logo);
    setOpenModalVoucher(true);
  }

  const getVoucherInfo = async (id:string) => {

    if (!id) return;
    await sendRequest({headers: {'Authorization' : 'Bearer ' + tokenUsr} , endpoint: `/voucher/${id}`, method: 'GET'}).then((response)=> {
      if (response && response.data) {
        setVoucherModal(response.data.voucher);
      }
    });
  }

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center gap-4 mt-8">
        <SearchInput value={searchValue} setSearchValue={setSearchValue}/>
        <SelectInput token={tokenUsr} setCategoryFilter={setSelectedCategory}/>
      </div>

        {paginedVouchers.length > 0  || (searchValue || selectedCategory && vouchersUsr.length > 0)?
            <div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 font-sans justify-center max-w-screen-xl mx-auto  mt-6 gap-8 lg:gap-0">
                    {(!searchValue && !selectedCategory ? paginedVouchers: vouchersUsr).map((voucher)=> {

                    return (
                        <Card key={voucher.voucher.partner.id} className="bg-white border border-gray-200 shadow-lg w-72 mx-auto lg:my-6" >
                        <CardHeader>
                            <div className="py-6 px-6 rounded-lg w-full h-full justify-center flex">
                                <Image className="xl:w-36 h-36 object-contain md:w-96 rounded-3xl lg:bg-white" width={350} height={350} src={`https://sistema.exclusivepass.com.br/api/files/${voucher.voucher.partner.logo}`} alt="" />
                            </div>
                            <p>{voucher.voucher.partner.fantasyName}</p>
                            <CardDescription >{voucher.voucher.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <button onClick={() => openModalVoucher(voucher.voucher)} className="bg-[#881DED] text-white font-bold py-2 px-4 rounded">Resgatar</button>
                        </CardContent>
                        </Card>
                    )
                
                    })}
                </div>

                <Pagination selectedPage={selectedPage} skipNumber={skipNumber} takeNumber={takeNumber} setSkipNumber={setSkipNumber} setSelectedPage={setSelectedPage} pagesCount={Math.round(vouchersUsr.length/takeNumber)}/> 
            
            </div>

            : <p className="text-center my-8">{searchValue || selectedCategory ? "Não foram encontrados vouchers para a sua pesquisa" : "Carregando vouchers..."}</p>
        }

      <ModalVoucher isOpen={isOpenModalVoucher} logoPartner={voucherPartnerLogo} tokenUsr={tokenUsr} voucher={voucherModal} onClose={closeModal}/>
    </>
  );
}

function searchVouchers(vouchersUser:VoucherProps[], keyword?:string, category?:string) {

  const regex = new RegExp(keyword || category || "",  'i');
  const vouchers =  keyword ? vouchersUser.filter((voucher) => 
    regex.test(voucher.voucher.title) || 
    regex.test(voucher.voucher.description) ||
    regex.test(voucher.voucher.partner.fantasyName)
  ) :  vouchersUser.filter((voucher)=> regex.test(voucher.voucher.partner.category.name));
  return vouchers;
}

function getVouchersUser(tokenUsr:string, setVouchers: Dispatch<SetStateAction<VoucherProps[]>>) {
    sendRequest({headers: {'Authorization' : 'Bearer ' + tokenUsr} , endpoint: '/voucher/member', method: 'GET'}).then((response)=> {
      if (response && response.data){
        const vouchersResponse = response.data.voucher;
        const filteredVouchers = vouchersResponse.filter((voucher: VoucherProps) => voucher.isAvailable);
        setVouchers(filteredVouchers);
        setLocalStorage({name: "vouchers", value: JSON.stringify(filteredVouchers)});
        }
    });
    
}

async function getVouchersOnCookies(){
    const data = await getLocalStorage("vouchers");
    return data? JSON.parse(data) : [];
}

async function getPaginedVouchersUser(tokenUsr:string, setPaginedVouchers:Dispatch<SetStateAction<VoucherProps[]>>, take:number, skip:number) {
    await sendRequest({headers: {'Authorization' : 'Bearer ' + tokenUsr} , endpoint: '/voucher/member?take='+ take + '&skip=' + skip, method: 'GET'}).then((response)=> {
        if(response && response.data) {
            setPaginedVouchers(response.data.voucher.filter((voucher:VoucherProps) => voucher.isAvailable));
        }
    });
}