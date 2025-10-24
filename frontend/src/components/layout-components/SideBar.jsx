import { useEffect, useState } from "react"
import { useUser } from '../../services/userContext'
import API from '../../services/API.js'

export default function SideBar() {
    const { user } = useUser();
    const [storeName, setStoreName] = useState('');

    useEffect(() => {
        if (!user || !user.id) return;

        API.get(`/ant-box/store/getStoreName/${user.id}`)
            .then((reponse) => {
                setStoreName(reponse.data?.nombre || 'Unknown');
            })
            .catch(err => console.error('Error fetching data: ', err));
    }, [user]);

    return (
        <div className="bg-white min-h-screen">
            <span className="text-2xl text-black">
                {storeName}
            </span>
        </div>
    )
}