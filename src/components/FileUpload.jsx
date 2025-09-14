import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, CheckCircle, AlertCircle, Github } from "lucide-react";

export default function FileUpload({project, projectId, fileType, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
//   const [project, setProject] = useState(false);


  const apiUrl = import.meta.env.VITE_API_BASE_URL;




  const alreadyUploaded =
    (fileType === "frontend" && project?.has_frontend) ||
    (fileType === "backend" && project?.has_backend);

  const repoUrl =
    fileType === "frontend"
      ? project?.github_repo_url?.frontend
      : project?.github_repo_url?.backend;

  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const selected = selectedFiles[0];
    if (selected.type !== "application/zip" && !selected.name.endsWith(".zip")) {
      setError("Only .zip files are allowed");
      return;
    }
    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      const response = await fetch(`${apiUrl}/file/${projectId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Upload failed");
        setUploadStatus("error");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {fileType === "frontend" ? "Frontend" : "Backend"} Upload
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {alreadyUploaded
                ? `Your ${fileType} is already uploaded`
                : `Upload your ${fileType} packaged in a .zip archive`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {alreadyUploaded ? (
            <div className="text-center py-8">
              <Github className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {fileType} Repository
              </h3>
              {repoUrl ? (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  {repoUrl}
                </a>
              ) : (
                <p className="text-red-500">Repo URL missing</p>
              )}
            </div>
          ) : uploadStatus === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600">
                Your .zip has been extracted and pushed to GitHub.
              </p>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Failed
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setUploadStatus("idle");
                  setError("");
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your .zip here or click to select
                </h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Choose .zip
                </button>
              </div>

              {file && (
                <div className="mt-6 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!alreadyUploaded && uploadStatus === "idle" && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
