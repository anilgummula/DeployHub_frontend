import { createContext, useState, } from 'react';


const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_BASE_URL;

console.log( "url: ",apiUrl);



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    

    const login = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/github`);
            const result = await response.json();
            if(result.redirectUrl){
            window.location.href = result.redirectUrl;
            } else {
                console.log("Error getting redirect URL:", result);
            }
        
        } catch (error) {
        console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
        // await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        window.location.href = '/';
        } catch (error) {
        console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };

export { AuthProvider, AuthContext };
