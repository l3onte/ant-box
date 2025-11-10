import { PackageMinus } from 'lucide-react';

export default function MinExistButton ({ onClick }) {
    return (
        <button
            onClick={onClick}
            className='flex items-center gap-1 text-black border border-gray-300 bg-gray-50 px-4 rounded shadow-sm cursor-pointer hover:bg-white'
        >
            <PackageMinus className='w-4'/>
            Stock al minimo
        </button>
    )
}