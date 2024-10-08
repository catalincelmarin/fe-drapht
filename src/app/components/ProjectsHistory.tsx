"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { setActiveProject, setIsProjectHistoryOpen, setProjects } from '@/app/redux/appSlice';
import { Button } from '@/app/components/ui/button';
import SearchInput from '@/app/components/SearchInput';
import { X, Folder } from 'lucide-react';
import { useState,useEffect } from 'react';
import { bootProject, fetchProjects } from '../api/genBotAPI';
import { AxiosResponse } from 'axios';


const ProjectsHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, activeProject } = useSelector((state: RootState) => state.app);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProject = (projectId: number) => {
  
    bootProject(projects[projectId].name,null).then(response => {
      if(response.data.status === "success") {
        console.log(response.data.message)
      }
    })
    dispatch(setActiveProject(projectId));
    dispatch(setIsProjectHistoryOpen(false));  // Close the history after selecting a project
  };

  return (
    <div className="fixed z-50 inset-y-0 right-0 w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#00e676]">Project History</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setIsProjectHistoryOpen(false))}
          className="text-gray-400 hover:text-[#00e676] hover:bg-[#2a2a2a] rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-[#2a2a2a]">
        <SearchInput
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 px-4 overflow-auto">
        {filteredProjects.map((project) => (
          <Button
            key={project.id}
            onClick={() => activeProject !== project.id && handleSelectProject(project.id)}
            className={`w-full bg-[#2a2a2a] hover:bg-[${activeProject === project.id ? '#1b1b1b' : '#3a3a3a'}] text-gray-${activeProject === project.id ? 600 : 100} justify-start px-4 py-2 mb-2 ${
              activeProject === project.id ? 'bg-[#00e676]' : ''
            }`}
          >
            <Folder className="h-4 w-4 mr-2" />
            {project.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsHistory;
