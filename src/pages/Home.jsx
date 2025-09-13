import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Github, ArrowRight, Zap, Globe, Cloud } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DeployHub</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Sign in with GitHub</span>
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Deploy your projects to{' '}
            <span className=" bg-clip-text ">
              <span className='text-green-500'>Render</span> & <span className='text-blue-500'>Netlify</span>
            </span>{' '}
            automatically
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Upload your frontend and backend files, create GitHub repositories, and deploy to production with just a few clicks. 
            No more manual deployments.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-slate-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 mx-auto hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 slide-in-up">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mb-6">
              <Github className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">GitHub Integration</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically create repositories in your GitHub account and push your project files with proper structure.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Netlify Frontend</h3>
            <p className="text-gray-600 leading-relaxed">
              Deploy your frontend applications to Netlify with automatic builds and global CDN distribution.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6">
              <Cloud className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Render Backend</h3>
            <p className="text-gray-600 leading-relaxed">
              Deploy your backend services to Render with automatic scaling and managed infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
