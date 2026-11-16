import { createContext } from "react";

interface ChangeFirebaseContextType {
    setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAndSetUserData: () => Promise<unknown>;
    logedUserUID: string
}

export const ChangeFirebaseContext = createContext<ChangeFirebaseContextType>({
    setIsInitialized: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.' + value);
    },
    fetchAndSetUserData: function (): Promise<void> {
        throw new Error('Function not implemented.');
    },
    logedUserUID: ""
})
