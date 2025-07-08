import {createContext, useState, useContext, useEffect, Children} from "react";

const ViajeContext = createContext();

export const useViajeContext = () => useContext(ViajeContext);

export const ViajeProvider = ({children}) => {
    
    //OMNIBUS PARA VIAJE
    const [omnibusViaje, setOmnibusViaje] = useState([]);

    useEffect(() => {
        localStorage.setItem('omnibusViaje', JSON.stringify(omnibusViaje));
    }, [omnibusViaje])

    const guardarOmnibus = (omnibus) => {
        setOmnibusViaje(omnibus);
    }

    const limpiarOmnibus = () => {
        setOmnibusViaje([]);
    }

    //VIAJE PARA CERRAR SU VENTA
    const [viajeCerrarVenta, setViajeCerrarVenta] = useState([]);

    useEffect(() => {
        localStorage.setItem('viajeCerrarVenta', JSON.stringify(viajeCerrarVenta));
    }, [viajeCerrarVenta])

    const guardarViajeCerraVenta = (viaje) => {
        setViajeCerrarVenta(viaje);
    }

    const limpiarViajeCerraVenta = (viaje) => {
        setViajeCerrarVenta([]);
    }

    //LAS FUNCIONES Y VARIABLES QUE SE PUEDEN UTLIIZAR
    const value = {
        guardarOmnibus,
        limpiarOmnibus,
        omnibusViaje,
        guardarViajeCerraVenta,
        limpiarViajeCerraVenta,
        viajeCerrarVenta
    }

    return <ViajeContext.Provider value={value}>
        {children}
    </ViajeContext.Provider>
}