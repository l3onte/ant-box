import { Link } from 'react-router-dom';

export default function Button({ name, type, to }) {

    const buttonTypes = {
        login: "bg-sky-400 text-white text-xl font-bold hover:bg-sky-300 transition transform duration-300",
        signup: "bg-red-400 text-white text-xl font-bold hover:bg-red-300 transition transform duration-300",
        submit: "bg-red-400 text-white text-xl font-bold hover:bg-red-300 transition transform duration-300"
    }
    
    return (
        type !== "submit" ? (
            <Link to={to} className={`text-center cursor-pointer p-2 rounded shadow-md ${buttonTypes[type] || ''}`}> 
                {name}
            </Link>
        ) : (
            <button type="submit" className={`text-center cursor-pointer p-2 rounded shadow-md ${buttonTypes[type] || ''}`}> 
                {name}
            </button>
        )
    )
}