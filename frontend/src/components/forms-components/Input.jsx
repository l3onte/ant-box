import { useState } from "react"
import { EyeClosed, Eye, Upload } from "lucide-react"

export default function Input({ type, placeholder, onChange, name, value }) {
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [fileName, setFileName] = useState("");

    const toggleEye = () => setIsEyeOpen(!isEyeOpen);
    const currentType = isEyeOpen ? "text" : "password";

    const baseStyle = "bg-gray-100/70 w-70 shadow-sm placeholder-gray-500 px-4 py-2 rounded transition";

     const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFileName(file ? file.name : "")
    }

    if (type === "file") {
        return (
            <div className="relative w-full">
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <Upload className="w-6 h-6 text-gray-500 mb-2" />
                    <span className="text-gray-600 text-sm text-center">
                        {fileName || "Haz clic o arrastra un archivo aquí"}
                    </span>
                    <input 
                        type="file" 
                        className="hidden" 
                        value={value}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        )
    }

    return (
        <div className="relative">
            {type !== "password" ? (

                <input 
                    className={`${baseStyle}`}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder} 
                />

            ) : (

                <>
                    <input 
                        className={baseStyle}
                        type={currentType}
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder} 
                    />
                    
                    <div className="absolute right-2 top-2 cursor-pointer"> 
                        {isEyeOpen ? (
                            <Eye onClick={toggleEye}/>
                        ) : (
                            <EyeClosed onClick={toggleEye}/>
                        )}
                    </div>
                </>
                
            )}
        </div>
    )
}