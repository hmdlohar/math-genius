"use client";


import Loading from "@/common/Loading";
import { useAuth } from "./AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { username, setUsername } = useAuth();
    
    if (username === null) {
        return <div className="p-8 flex justify-center">
            <Loading />
        </div>
    }
    if (username === "") {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-semibold mb-4">You must be logged in to view this.</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username..."
                        id="username-input"
                    />
                    <button
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => {
                            const input = document.getElementById("username-input") as HTMLInputElement;
                            if (input.value) {
                                setUsername(input.value);
                            }
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }
    return <>{children}</>;
}