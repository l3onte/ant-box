import { useState, useEffect, useRef } from "react";
import { Search, User, ChevronDown, ChevronUp, LogOut } from "lucide-react"
import { useUser } from "../../services/userContext"

export default function Header() {
    const { user } = useUser();
    const [dropIsDown, setDropIsDown] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropDown = () => setDropIsDown(!dropIsDown);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropIsDown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex justify-between bg-gray-50 px-5 py-3 w-full">
            <div className="flex items-center gap-2">
                <button className="cursor-pointer">
                    <Search className="w-4"/>
                </button>
                <input 
                    className="text-sm text-gray-400 focus:outline-none"
                    type="search" 
                    placeholder="Buscar aquí..." 
                />
            </div>

            <div className="relative" ref={dropdownRef}>
                <div 
                    className="flex gap-2 items-center cursor-pointer" 
                    onClick={toggleDropDown}
                >
                    <User className="w-5"/>
                    <span className="text-gray-600 text-sm">
                        {user.username || 'Invitado'}
                    </span>
                    
                    {dropIsDown ? (
                        <ChevronUp className="w-3"/>
                    ) : (
                        <ChevronDown className="w-3" />
                    )}
                </div>

                {dropIsDown && (
                    <div className="absolute right-0 mt-3 bg-white  rounded shadow-md text-[12px] z-10 cursor-pointer">
                        <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 cursor-pointer">
                            <LogOut className="w-6" />
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}