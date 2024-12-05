"use client";
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext<{
    username: string | null;
    setUsername: (username: string) => void;
}>({
    username: null,
    setUsername: () => {

    }
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState(() => {
        if (typeof window === "undefined") {
            return null;
        }
        try {
            return localStorage.getItem("username") || "";
        } catch (error) {
            console.error("Failed to read from localStorage:", error);
            return "";
        }
    });

    const updateUsername = useCallback((newUsername: string) => {
        try {
            setUsername(newUsername);
            localStorage.setItem("username", newUsername);
        } catch (error) {
            console.error("Failed to save username:", error);
        }
    }, []);

    return <AuthContext.Provider value={{
        username,
        setUsername: updateUsername
    }}>{children}</AuthContext.Provider>;
}