import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react';

export default function SideBarItems({ name, to, icon }) {
    const IconComponent = Icons[icon];
    
    return (
        <Link  
            to={to}
            className='flex items-center gap-2 text-[12px] text-gray-600 hover:bg-red-200/20 py-2 px-3 hover:border-r-4 hover:text-red-400 border-red-500'
        >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {name}
        </Link>
    )
}