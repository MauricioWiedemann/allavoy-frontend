import {createContext, useState, useContext, useEffect, Children} from "react";

const ViajeContext = createContext();

export const useViajeContext = () => useContext(ViajeContext);

export const ViajeProvider = ({children}) => {
    const [omnibusViaje, setOmnibusViaje] = useState([]);

    useEffect(() => {
        localStorage.setItem('omnibusViaje', JSON.stringify(omnibusViaje));
    }, [omnibusViaje])

    const guardarOmnibus = (omnibus) => {
        setOmnibusViaje(omnibus);
    }

    const value = {
        guardarOmnibus,
        omnibusViaje
    }

    return <ViajeContext.Provider value={value}>
        {children}
    </ViajeContext.Provider>
}