import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Button({ name, type, variant, to, onClick }) {

    const buttonVariant = {
        login: "bg-sky-400 text-white text-xl font-bold hover:bg-sky-300 transition transform duration-300",
        signup: "bg-red-400 text-white text-xl font-bold hover:bg-red-300 transition transform duration-300",
        add: "bg-green-400 text-white text-xl font-bold hover:bg-green-300 transition transform duration-300 text-[15px]",
        addForm: "bg-green-400 text-white text-xl font-bold hover:bg-green-300 transition transform duration-300 text-[15px]"
    }
    
    if (variant === "add") return (
        <button 
            type="submit" 
            className={`text-center cursor-pointer p-2 rounded shadow-md flex items-center gap-2 ${buttonVariant[variant]}`}
            onClick={onClick}
        > 
            <Upload className='w-4'/>
            {name}
        </button>
    )

    return (
        type !== "submit" ? (
            <Link to={to} className={`text-center cursor-pointer p-2 rounded shadow-md ${buttonVariant[variant]}`}> 
                {name}
            </Link>
        ) : (
            <button type="submit" className={`text-center cursor-pointer p-2 rounded shadow-md ${buttonVariant[variant]}`}> 
                {name}
            </button>
        )
    )
}