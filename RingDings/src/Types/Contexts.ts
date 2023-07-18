export interface ProviderProps {
    children: React.ReactNode;
}

export interface UtilsData {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    alert: {
        alertStatus: string;
        alertBody: string;
    },
    showAlert(alertType: string, alertMessage: string): void;
}

export interface UserData {
    name: string;
    balance: number;
}

export interface AuthData {
    userData: UserData;
    verifyPreLogin(): Promise<boolean>;
    makeLogout(): void;
    updateUserData: React.Dispatch<React.SetStateAction<UserData>>;
}