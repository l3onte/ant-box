import { createContext, useState, useContext, useEffect } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, setStore] = useState(() => {
        const saved = localStorage.getItem('store');
        return saved ? JSON.parse(saved) : null;
    });

    return (
        <StoreContext value={{ store, setStore }}>
            {children}
        </StoreContext>
    )
}

export function useStore() {
    return useContext(StoreContext);
}