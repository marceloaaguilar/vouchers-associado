import { sendRequest } from "@/lib/sendRequest";
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface SelectInputProps {
  token: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>
}

interface Categorie {
  id: number,
  name: string
}

export default function SelectInput({token, setCategoryFilter}: SelectInputProps) {

  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories(token);
        setCategories(result);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, [token]);

  return (
    <div className="relative w-full">
      <select defaultValue={""} onChange={(e)=> setCategoryFilter(e.currentTarget.value)}
        className="p-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
         focus:ring-blue-500 focus:border-blue-500 block w-full appearance-none dark:bg-gray-700
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="" > Buscar por categoria</option>
        {Array.isArray(categories) ? categories.map((categorie) => {
          return <option key={categorie.id} >{categorie.name} </option>
        }
      ): ""}
      
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export async function getCategories(token:string){
  let categories:Categorie[] = [];
  if (token){
    await sendRequest({headers: {'Authorization' : 'Bearer ' + token} , endpoint: `/category`, method: 'GET'}).then((response)=> {
      if (response && response.data) {
        categories =  response.data.categories;
      }
    })
  }

  return categories;
}
