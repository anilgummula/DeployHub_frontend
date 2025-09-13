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
            const data = await response.redirected;
            if(data.redirectUrl){
                // console.log("result: ",result.data);
                window.location.href = data.redirectUrl;

            }
            else{
                console.log("error: ",result);
                
            }
        
        //   const data = await response.json();
        //   if (data.redirectUrl) {
        //     window.location.href = data.redirectUrl;
        //   }
        // console.log("message: ",data);
        
        } catch (error) {
        console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        window.location.href = '/';
        } catch (error) {
        console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
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
