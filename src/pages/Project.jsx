import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Github,
  Globe,
  Cloud,
  Calendar,
  Loader2,
} from "lucide-react";
import FileUpload from "../components/FileUpload";

export default function Project() {
  const { user, setUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [showUpload, setShowUpload] = useState(null);
    const [deployStatus,setDeployStatus] = useState("");
  // Hydrate user from localStorage if context is empty
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
    }
  }, [user, setUser, navigate]);

  // Fetch project when user and id are ready
  useEffect(() => {
    if (user && id) fetchProject();
  }, [user, id]);

  const fetchProject = async () => {
    setLoadingProject(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/project/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data: ",data);
        // console.log("status: ",deploymentStatus);
        console.log("status: ",data.project.deployment_status);
        setDeployStatus(data.project.deployment_status);
        
        
        setProjectData(data);
      } else if (response.status === 404) {
        navigate("/dashboard");
      } else {
        console.error("Failed to fetch project:", response.status);
      }
    } catch (err) {
      console.error("Failed to fetch project:", err);
    } finally {
      setLoadingProject(false);
    }
  };

  const handleFileUploadSuccess = () => {
    setShowUpload(null);
    fetchProject();
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (authLoading || loadingProject) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Project not found
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { project } = projectData;
  console.log("project: ",project);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-2">
            <img
              src={user?.avatar_url}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Project Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
        <span className="font-semibold">Description: </span>
        <p className="mb-6 text-slate-600">{project.description}</p>

        {/* Heading if files already uploaded */}
        {(project.has_frontend || project.has_backend) && (
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Files already uploaded on following repo's :
          </h2>
        )}

        <div className="flex space-x-4 mt-6">
          {/* Frontend */}
          {project.has_frontend ? (
            <a
              href={project.github_repo_url?.frontend}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-600 font-semibold border-2 border-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors hover:scale-102  "
            >
              <Github className="w-4 h-4" />
              <span>Go to Frontend Repo</span>
            </a>
          ) : (
            <button
              onClick={() => setShowUpload("frontend")}
              className="text-indigo-600 font-semibold border-2 border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Upload Frontend Files
            </button>
          )}

          {/* Backend */}
          {project.has_backend ? (
            <a
              href={project.github_repo_url?.backend}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-purple-600 font-semibold border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors hover:scale-102"
            >
              <Github className="w-4 h-4" />
              <span>Go to Backend Repo</span>
            </a>
          ) : (
            <button
              onClick={() => setShowUpload("backend")}
              className="text-purple-600 font-semibold border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Upload Backend Files
            </button>
          )}
        </div>

        {/* File Upload Modal */}
        {showUpload && (
          <FileUpload
            projectId={project._id}
            project={project}
            fileType={showUpload}
            onClose={() => setShowUpload(null)}
            onSuccess={handleFileUploadSuccess}
          />
        )}
        <div>
            {
                project.has_frontend&&project.has_backend?(
                deployStatus=="pending" ? (
                    <div className="flex-col mt-10 space-y-8">
                        <h3 className="flex "><span className="font-bold text-xl ">Deploy status &nbsp;:</span>&nbsp; <span className="text-yellow-500 px-2 font-semibold text-md border-2 border-yellow-500 mx-2 rounded-md">PENDING</span></h3>
                        <h3 className="font-semibold text-sm text-slate-500">Make Your Project live by clicking below button</h3>
                        <button type="button" className=" flex border-2 border-red-600 text-red-600 font-semibold px-2 py-1 rounded-md hover:bg-red-100">
                            DEPLOY
                        </button>
                    </div>
                ):(
                    <div className="flex-col mt-10 space-y-8">
                        <h3 className="flex "><span className="font-bold text-xl ">Deploy status &nbsp;:</span>&nbsp; <span className="text-green-500  px-2 font-semibold text-md border-2 border-green-500 mx-2 rounded-md">LIVE</span> </h3>
                        <h3 className="font-semibold text-sm text-slate-500">Project is live at below links</h3>
                        <div className=" flex  font-semibold pr-2 py-1 ">
                            <h3 className="flex mr-2"> Your Frontend Page :</h3>
                            <a href="http://localhost:5000" className="text-red-600 hover:border-b"> http://localhost:5000</a>
                        </div>
                        <div className=" flex  font-semibold pr-2 py-1 ">
                            <h3 className="flex mr-2"> Your Backend API : :</h3>
                            <a href="http://localhost:5000" className="text-red-600 hover:border-b"> http://localhost:5000</a>
                        </div>
                        
                    
                    </div>
                )):( <div>

                </div>)
            }
        </div>
      </div>
    </div>
  );
}
