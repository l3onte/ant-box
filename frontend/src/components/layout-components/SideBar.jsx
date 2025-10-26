import { useStore } from "../../services/storeContext.jsx";
import { Box  } from 'lucide-react';
import SideBarItems from "./SideBarItems.jsx";
import itemsJSON from "../../data/sideBarItems.json";
import SwitchButton from "./SwitchButton.jsx";

export default function SideBar() {
    const { store } = useStore();

    const groupedItems = itemsJSON.reduce((acc, item) => {
        if (!acc[item.category])  acc[item.category] = [];

        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="bg-white min-h-screen w-40 shadow-sm flex py-3 flex-col justify-between">
            <div className="flex flex-col justify-center gap-2">
                <div className="flex items-center justify-center gap-1">
                    <Box className="text-gray-500"/>
                    <div className="flex flex-col">
                        <span className="text-md font-bold text-red-300">
                            {store?.nombre || 'Sin tienda'}
                        </span>

                        <span className="text-[9px] text-gray-400">Administrador</span>
                    </div>
                </div>

                <div>
                    {Object.keys(groupedItems).map((category, idx) => (
                        <div key={idx} className="flex flex-col mg-4">
                            <span className="px-3 text-[10px] text-gray-400 py-2">{category}</span>
                            {groupedItems[category].map((item, index) => (
                                <SideBarItems
                                    key={index} 
                                    name={item.name}
                                    to={item.path}
                                    icon={item.icon}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2">
                <span className="text-[10px]">Modo Oscuro</span>
                <SwitchButton />
            </div>
        </div>
    )
}