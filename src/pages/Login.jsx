import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Github, Zap, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DeployHub</h1>
            <p className="text-gray-600">Sign in with GitHub to get started</p>
          </div>

          <button
            onClick={login}
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Auto Deploy</h3>
            <p className="text-xs text-gray-600">Deploy to Render & Netlify</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">GitHub Sync</h3>
            <p className="text-xs text-gray-600">Create repos automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}
