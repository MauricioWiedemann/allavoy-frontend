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

    const [viajeCerrarVenta, setViajeCerrarVenta] = useState([]);

    useEffect(() => {
        localStorage.setItem('viajeCerrarVenta', JSON.stringify(viajeCerrarVenta));
    }, [viajeCerrarVenta])

    const guardarViajeCerraVenta = (viaje) => {
        setViajeCerrarVenta(viaje);
    }

    const value = {
        guardarOmnibus,
        omnibusViaje,
        guardarViajeCerraVenta,
        viajeCerrarVenta
    }

    return <ViajeContext.Provider value={value}>
        {children}
    </ViajeContext.Provider>
}