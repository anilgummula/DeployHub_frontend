import { useEffect, useState } from 'react';
import { AuthContext} from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, Github, Globe, Cloud, Calendar, FileText, CheckCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useContext } from 'react';

export default function ProjectPage() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpload, setShowUpload] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchProject();
    }
  }, [user, id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProjectData(data);
      } else if (response.status === 404) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoadingProject(false);
    }
  };

  const handleFileUploadSuccess = () => {
    setShowUpload(null);
    fetchProject();
  };

  const createGitHubRepo = async () => {
    if (!projectData) return;

    try {
      const repoName = projectData.project.title.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectData.project.id,
          repoName,
          description: projectData.project.description,
          isPrivate: false,
        }),
      });

      if (response.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Failed to create GitHub repo:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return '⚡';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  if (loading || loadingProject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { project, files, deployments } = projectData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.avatar_url || ''} 
                  alt={user?.name || ''}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
              {project.description && (
                <p className="text-gray-600">{project.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.deployment_status === 'deployed' ? 'bg-green-100 text-green-800' :
                project.deployment_status === 'deploying' ? 'bg-blue-100 text-blue-800' :
                project.deployment_status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.deployment_status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.created_at)}</span>
            </div>
            {project.github_repo_url && (
              <div className="flex items-center space-x-1">
                <Github className="w-4 h-4" />
                <a 
                  href={project.github_repo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  View Repository
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'files', label: 'Files', icon: Upload },
                { id: 'deployments', label: 'Deployments', icon: Cloud },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Frontend</h3>
                      </div>
                      {project.has_frontend && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <p className="text-green-700 text-sm mb-4">
                      {project.has_frontend ? 'Frontend files uploaded' : 'Upload your frontend files (React, HTML, CSS, etc.)'}
                    </p>
                    <button
                      onClick={() => setShowUpload('frontend')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {project.has_frontend ? 'Update Files' : 'Upload Frontend'}
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Backend</h3>
                      </div>
                      {project.has_backend && <CheckCircle className="w-5 h-5 text-purple-600" />}
                    </div>
                    <p className="text-purple-700 text-sm mb-4">
                      {project.has_backend ? 'Backend files uploaded' : 'Upload your backend files (Node.js, Python, etc.)'}
                    </p>
                    <button
                      onClick={() => setShowUpload('backend')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      {project.has_backend ? 'Update Files' : 'Upload Backend'}
                    </button>
                  </div>
                </div>

                {/* GitHub Repository */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Github className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">GitHub Repository</h3>
                    </div>
                    {!project.github_repo_url && (
                      <button
                        onClick={createGitHubRepo}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        Create Repository
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {project.github_repo_url 
                      ? `Repository created: ${project.github_repo_name}`
                      : 'Create a GitHub repository to version control your code'
                    }
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-6">
                {files.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No files uploaded</h3>
                    <p className="text-gray-600 mb-6">Upload your frontend and backend files to get started.</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowUpload('frontend')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Upload Frontend
                      </button>
                      <button
                        onClick={() => setShowUpload('backend')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      >
                        Upload Backend
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['frontend', 'backend'].map((type) => {
                      const typeFiles = files.filter(file => 
                        type === 'frontend' ? file.is_frontend : file.is_backend
                      );
                      
                      if (typeFiles.length === 0) return null;

                      return (
                        <div key={type} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 capitalize flex items-center space-x-2">
                              {type === 'frontend' ? <Globe className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                              <span>{type} Files</span>
                            </h4>
                            <button
                              onClick={() => setShowUpload(type)}
                              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                            >
                              Add Files
                            </button>
                          </div>
                          <div className="grid gap-2">
                            {typeFiles.map((file) => (
                              <div key={file.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                                <span className="text-lg">{getFileIcon(file.file_name)}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{file.file_name}</p>
                                  <p className="text-xs text-gray-500">
                                    {file.file_size ? `${Math.round(file.file_size / 1024)} KB` : 'Unknown size'} • 
                                    {formatDate(file.created_at)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deployments' && (
              <div className="space-y-4">
                {deployments.length === 0 ? (
                  <div className="text-center py-12">
                    <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No deployments yet</h3>
                    <p className="text-gray-600">Deploy your frontend to Netlify and backend to Render.</p>
                  </div>
                ) : (
                  deployments.map((deployment) => (
                    <div key={deployment.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {deployment.deployment_type === 'frontend' ? <Globe className="w-5 h-5 text-green-600" /> : <Cloud className="w-5 h-5 text-purple-600" />}
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{deployment.deployment_type} Deployment</p>
                          <p className="text-xs text-gray-500">{formatDate(deployment.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deployment.status === 'deployed' ? 'bg-green-100 text-green-800' :
                          deployment.status === 'deploying' ? 'bg-blue-100 text-blue-800' :
                          deployment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {deployment.status}
                        </span>
                        {deployment.deployment_url && (
                          <a
                            href={deployment.deployment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                          >
                            View Site
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          projectId={parseInt(id)}
          fileType={showUpload}
          onClose={() => setShowUpload(null)}
          onSuccess={handleFileUploadSuccess}
        />
      )}
    </div>
  );
}
