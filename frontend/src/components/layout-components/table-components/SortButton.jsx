import { ArrowDownAZ, ArrowDownZA } from 'lucide-react';

export default function SortButton() {
    return (
        <button className="flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white">
            <ArrowDownAZ className='w-4'/>
            Sort
        </button>
    )
}