import { useEffect, useState } from 'react';
import { AuthContext} from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContext } from 'react';

export default function AuthCallback() {
  const { user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

//   useEffect(() => {
//     // This page is handled by the backend redirect
//     // Just show success and redirect to dashboard
//     setStatus('success');
//     setTimeout(() => {
//       navigate('/dashboard');
//     }, 1500);
//   }, [navigate]);
    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginStatus = params.get("login");
    const token = params.get("token");
    const userInfo = params.get("userData");

    if (loginStatus === "success" && userInfo) {
        const parsedUser = JSON.parse(decodeURIComponent(userInfo));
        setUser(parsedUser);
        localStorage.setItem("token",token);
        localStorage.setItem("userData",JSON.stringify(parsedUser));
        console.log("userData: ",localStorage.getItem("userData"));
        console.log("userData parsed user: ",parsedUser);
        
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1500);
    } else {
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
    }
    }, [navigate, setUser]);


  useEffect(() => {
    if (user && status === 'loading') {
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h1>
              <p className="text-gray-600">Please wait while we authenticate your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Welcome to DeployHub!</h1>
              <p className="text-gray-600">You've been successfully signed in. Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h1>
              <p className="text-gray-600 mb-4">
                {error || 'Something went wrong during authentication.'}
              </p>
              <p className="text-sm text-gray-500">Redirecting you back to the login page...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
