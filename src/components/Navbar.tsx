import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { getCookies, removeToken } from './CookiesManagement';
import { TicketPercent } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function Navbar() {

  const [userName, setUserName] = useState<string>("");
  const [partner, setPartner] = useState<string>("");
  const handleLogout = async ()=> {
    await removeToken();
    window.location.reload();
  }

  useEffect(()=> {
    getCookies("userName").then((response) => {
      if (response) {
        setUserName(response)
      };
    });

    getCookies("partner").then((response) => {
      if (response) {
        setPartner(response)
      };
    });

  },[])


  return (
    <Disclosure as="nav" className="bg-white shadow-md" >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <TicketPercent className="self-center" color="#881ded" size={64}/>
            </div>
        
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {(userName && partner ? (
              <div className="flex gap-2">
                <span className='text-black'>{userName} | </span>
                <span className='text-black'>{partner}</span> 
              </div>
            ): "")}

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full text-sm">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <Image
                    alt=""
                    src={"/userAvatar.png"}
                    className="size-8 rounded-full"
                    width={350} height={350}
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >

                <MenuItem>
                  <button
                    onClick={() => handleLogout()}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sair
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

  
    </Disclosure>
  )
}
