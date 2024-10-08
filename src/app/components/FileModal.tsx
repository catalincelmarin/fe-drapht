"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Upload, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createFile, fetchStructure, saveFile } from '../api/genBotAPI';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { AxiosResponse } from 'axios';
import { FolderStructure, setProjectStructure } from '../redux/appSlice';

type FileModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  folder: string;
};

const FileModal: React.FC<FileModalProps> = ({ isModalOpen, closeModal, folder }) => {
  const [fileName, setFileName] = useState('');
  const [isFolder,setIsFolder] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // Track the active tab
  const { activeProject, projects } = useSelector((state: RootState) => state.app);
  
  const dispatch = useDispatch();
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  // Handler for uploading the file
  const handleUploadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return; // No file selected, do nothing

    setIsUploading(true);

    try {
      const response = await createFile(projects[activeProject].name,{name:selectedFile.name, path: folder},selectedFile);
      
        fetchStructure(projects[activeProject].name)
        .then((response: AxiosResponse<FolderStructure>) => {
          
          dispatch(setProjectStructure(response.data));
        }).catch(err=>{
          console.log(err);
        })
      
    } catch (err: any) {
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
      closeModal(); // Close modal after operation
    }
  };

  // Handler for creating a file by name (without upload)
  const handleEnterFileNameFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName) return; // No file name entered, do nothing

    setIsUploading(true);

    const fileMetadata = {
      name: fileName,  // Use the entered file name
      path: folder,    // Use the folder path passed as a prop
      isFolder: isFolder,
      isNew: true,
      content: ""
    };

    try {
      const response = await saveFile(projects[activeProject].name, fileMetadata);
      fetchStructure(projects[activeProject].name)
      .then((response: AxiosResponse<FolderStructure>) => {
        
        dispatch(setProjectStructure(response.data));
      }).catch(err=>{
        console.log(err);
      })
    } catch (err: any) {
      console.error('Error creating file by name:', err);
    } finally {
      setIsUploading(false);
      closeModal(); // Close modal after operation
      setFileName(''); // Clear the input field
    }
  };

  return (
    <dialog className="absoute z-10 bg-[#1a1a1a] text-gray-100 rounded-lg p-6 w-full" open={isModalOpen}>
      <h3 className="text-xl font-semibold mb-4 text-[#00e676]">Manage Files</h3>
      <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-transparent">
          <TabsTrigger
            value="upload"
            className={`mr-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'upload' ? 'bg-[#1a1a1a] text-green-600' : 'bg-[#1a1a1a] text-gray-600 hover:bg-[#2a2a2a]'
            }`}
          >
            Upload File
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className={`mr-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'add' ? 'bg-[#1a1a1a] text-green-600' : 'bg-[#1a1a1a] text-gray-600 hover:bg-[#2a2a2a]'
            }`}
          >
            Add File by Name
          </TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="upload">
          <form onSubmit={handleUploadFormSubmit}>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-[#444] p-4 rounded-md text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <p className="text-sm text-gray-400">Selected file: {selectedFile.name}</p>
              ) : (
                <p className="text-sm text-gray-400">Drag & drop a file here, or click to select one</p>
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                onClick={closeModal}
                variant="outline"
                className="border-[#444] bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00e676] hover:bg-[#00c853] text-[#121212]"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Add File by Name Tab */}
        <TabsContent value="add">
        <form onSubmit={handleEnterFileNameFormSubmit}>
  <div>
    <label htmlFor="fileName" className="block text-sm font-medium mb-2">
      File Name
    </label>
    <input
      id="fileName"
      type="text"
      value={fileName}
      onChange={handleFileNameChange}
      placeholder="Enter file name"
      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded text-gray-100"
    />
  </div>

  <div className="flex items-center mt-4">
    <input
      id="isFolder"
      type="checkbox"
      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 bg-[#2a2a2a]"
      onChange={(e) => setIsFolder(e.target.checked)}
    />
    <label htmlFor="isFolder" className="ml-2 block text-sm font-medium text-gray-100">
      Is Folder
    </label>
  </div>

  <div className="flex justify-end mt-4 space-x-2">
    <Button
      onClick={closeModal}
      variant="outline"
      className="border-[#444] bg-[#2a2a2a] hover:bg-[#3a3a3a]"
      disabled={isUploading}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      className="bg-[#00e676] hover:bg-[#00c853] text-[#121212]"
      disabled={!fileName || isUploading}
    >
      {isUploading ? (
        <>
          <Save className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save File
        </>
      )}
    </Button>
  </div>
</form>

        </TabsContent>
      </Tabs>
    </dialog>
  );
};

export default FileModal;
