import React, { createContext, useContext, useState } from "react";
import { ProviderProps, UtilsData } from "../Types/Contexts";

const UtilsContext = createContext<UtilsData>({} as UtilsData);

export const UtilsProvider: React.FC<ProviderProps> = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState<number>();
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [alertBody, setAlertBody] = useState<string>('');

    function showAlert(alertType: string, alertMessage: string){
        clearTimeout(timer);
        setAlertStatus(alertType);
        setAlertBody(alertMessage);
        setTimer(setTimeout(() => {
            setAlertStatus('unknown');
            setAlertBody('');
        }, 5000));
    }

    return (
        <UtilsContext.Provider value={{ setIsLoading, isLoading, alert: { alertStatus, alertBody }, showAlert }}>
            { children }
        </UtilsContext.Provider>
    );
};

export function useUtils(){
    const context = useContext(UtilsContext);
    return context;
}