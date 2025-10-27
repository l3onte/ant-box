import { SearchIcon } from "lucide-react"

export default function Search() {
    return (
        <div className="flex gap-3 items-center">
            <SearchIcon className="w-4 cursor-pointer"/>
            <input 
                className="focus:outline-none"
                type="search" 
                placeholder="Buscar en la tabla..."/>
        </div>
    )
}