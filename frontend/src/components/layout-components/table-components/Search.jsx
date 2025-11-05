import { SearchIcon } from "lucide-react"
import { useState } from "react"

export default function Search({ onSearch }) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        onSearch(val);
    }

    return (
        <div className="flex gap-3 items-center">
            <SearchIcon className="w-4 cursor-pointer"/>
            <input 
                className="focus:outline-none"
                type="search" 
                placeholder="Buscar en la tabla..."
                onChange={handleChange}
                value={value}    
            />
        </div>
    )
}