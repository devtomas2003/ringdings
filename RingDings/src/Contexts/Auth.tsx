import React, { createContext, useContext, useState } from "react";
import type { AuthData, ProviderProps, UserData } from "../Types/Contexts";
import api from "../services/api";

const AuthContext = createContext<AuthData>({} as AuthData);

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {

    const [userData, setUserData] = useState<UserData>({} as UserData);

    async function verifyPreLogin(): Promise<boolean>{
        if(localStorage.getItem("@spacelabs/auth")){
            try{
                const validAuth = await api.get('/validateAuth', {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("@spacelabs/auth")
                    }
                });
                setUserData(validAuth.data);
                api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("@spacelabs/auth");
                return true;
            }catch(e){
                localStorage.removeItem("@spacelabs/auth");
                return false;
            }
        }else{
            return false;
        }
    }

    function makeLogout(){
        localStorage.removeItem("@spacelabs/auth");
        location.href = "/";
    }

    return (
        <AuthContext.Provider value={{ userData, verifyPreLogin, makeLogout, updateUserData: setUserData }}>
            { children }
        </AuthContext.Provider>
    );
};

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}