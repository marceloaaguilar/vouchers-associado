import { Dispatch, SetStateAction} from "react";

interface PaginationProps {
  pagesCount: number,
  selectedPage: number,
  setSelectedPage: Dispatch<SetStateAction<number>>
  setSkipNumber: Dispatch<SetStateAction<number>>,
  takeNumber: number,
  skipNumber: number,
}

export default function Pagination({pagesCount, selectedPage, setSelectedPage,setSkipNumber, takeNumber, skipNumber}:PaginationProps) {

    const managePage = (type: string, index?: number) => {
        setSelectedPage(index || 0);
        setSkipNumber(((index || 0) - 1) * takeNumber );
    }

    const manageNextPage = () => {
        console.log("teste");
        if ((selectedPage + 1) <= pagesCount) {
            setSelectedPage(selectedPage + 1);
            setSkipNumber(selectedPage * takeNumber);
            return;
        }
    };

    const managePreviousPage = () => {
        if (selectedPage > 1){
            setSelectedPage(selectedPage - 1 );
            setSkipNumber(skipNumber - takeNumber);
        }
    }
    return (
        pagesCount > 0 ? 
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <a href="#" onClick={managePreviousPage} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Anterior</a>
                    <a href="#" onClick={manageNextPage} className=" ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Próximo</a>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                    <a href="#" onClick={managePreviousPage}  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Anterior</span>
                        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    </a>

                    {
                        (() => {
                            const newPages = [];
                            for (let i = 1; i <= pagesCount; i++) {
                                newPages.push(
                                    <a
                                        key={i}
                                        href="#"
                                        onClick={() => {
                                            managePage("next", i)
                                        }}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${i === selectedPage 
                                            ? "bg-[#881DED] text-white z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#881DED]" 
                                            : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        }`}
                                    >
                                        {i}
                                    </a>
                                );
                            }
                            return newPages;
                        })()
                    }
                
                    <button type="button" onClick={manageNextPage} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only" >Próximo</span>
                        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    </nav>
                </div>
            </div> 
        : ""
    )
}
