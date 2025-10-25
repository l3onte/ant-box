import { Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react';

export default function SideBarItems({ name, to, icon }) {
    const IconComponent = Icons[icon];
    const location = useLocation();

    const isActive = location.pathname == to;

    return (
        <Link  
            to={to}
            className={`flex items-center gap-2 text-[12px] py-2 px-3 ${isActive ?
                `bg-red-200/20  border-r-4 text-red-400 border-red-500` : 
                `text-gray-600 hover:bg-red-100/10 hover:border-r-4 hover:text-red-300 border-red-300`
            }`}
        >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {name}
        </Link>
    )
}