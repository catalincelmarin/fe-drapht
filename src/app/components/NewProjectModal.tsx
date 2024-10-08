"use client";

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { RootState } from '@/app/redux/store';
import {
  setNewProjectName,
  setNewProjectDescription,
  setIsNewProjectModalOpen,
  addProject,
  setIsCreatingProject,
} from '@/app/redux/appSlice';
import CustomInput from '@/app/components/CustomInput';
import CustomTextarea from '@/app/components/CustomTextarea';
import { bootProject, Message } from '../api/genBotAPI';
import { AxiosResponse } from 'axios';

const NewProjectModal: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isNewProjectModalOpen,
    newProjectName,
    newProjectDescription,
    isCreatingProject,
  } = useSelector((state: RootState) => state.app);

  const [samplePhoto, setSamplePhoto] = useState<File | null>(null);

  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSamplePhoto(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:{'image/png': [".png"]},
    multiple: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      
      bootProject("new",{project:newProjectName,prompt:newProjectDescription},samplePhoto).then((response: AxiosResponse<Message>) =>{
        dispatch(setIsNewProjectModalOpen(false));
        if(response.data.status === "success") {
          
          dispatch(setNewProjectName(''));
          dispatch(setNewProjectDescription(''));
          dispatch(setIsCreatingProject(true));
          
        }
        
      }).catch(err => {
        console.log(err)
      })
    }
  };

  return (
    <dialog
      id="newProjectModal"
      className="bg-[#1a1a1a] text-gray-100 rounded-lg p-6 w-[400px]"
      open={isNewProjectModalOpen}
    >
      <h3 className="text-xl font-semibold mb-4 text-[#00e676]">Create New Project</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <CustomInput
            value={newProjectName}
            onChange={(e) => dispatch(setNewProjectName(e.target.value))}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
            Project Description
          </label>
          <CustomTextarea
            
            value={newProjectDescription}
            onChange={(e) => dispatch(setNewProjectDescription(e.target.value))}
            placeholder="Enter a short description of your project"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sample Photo</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-600 text-gray-600 border-gray-600 rounded-md p-4 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {samplePhoto ? (
              <p>{samplePhoto.name}</p>
            ) : isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag & drop a sample photo here, or click to select one</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => dispatch(setIsNewProjectModalOpen(false))}
            className="border-[#444] bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 rounded px-3 py-2"
            disabled={isCreatingProject}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#00e676] hover:bg-[#00c853] text-[#121212] px-4 py-2 rounded"
            disabled={isCreatingProject}
          >
            {isCreatingProject ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default NewProjectModal;
