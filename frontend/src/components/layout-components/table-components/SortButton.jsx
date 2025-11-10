import { ArrowDownAZ, ArrowDownZA } from 'lucide-react';
import { useState } from 'react';

export default function SortButton({ onSort }) {
    const [sortOrder, setSortOrder] = useState('ASC');

    const toggleSort = () => {
        const newOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortOrder(newOrder);
        onSort(newOrder);
    }

    return (
        <button 
            onClick={toggleSort}
            className="flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white"
        >
            {sortOrder === 'ASC' ? <ArrowDownAZ className='w-4'/> : <ArrowDownZA className='w-4'/>}
            <span>{sortOrder === 'ASC' ? 'Ascendente' : 'Descendente'}</span>
        </button>
    )
}