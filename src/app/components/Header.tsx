"use client";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Button } from "@/app/components/ui/button";
import { Plus, History, GitFork, LogIn, Layers, LogOut } from 'lucide-react';
import { setIsProjectHistoryOpen, setIsNewProjectModalOpen, setIsGitModalOpen } from '@/app/redux/appSlice';
import {logout} from "@/app/redux/auth/authSlice";
import SocketBox from '@/app/components/SocketBox'; // Import the SocketBox component
import { useEffect, useState } from 'react';
import { executeGitCommand } from '../api/genBotAPI';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated: isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { projects,activeProject } = useSelector((state: RootState) => state.app);

  

  // Handle border flashing when message ends with "..."
  

  return (
    <header className="flex justify-between p-2 border-b border-[#2a2a2a]">
      {/* Header Title */}
      <div className="flex items-center space-x-3">
        <Layers className="h-10 w-10 text-green-600" />
        <h1 className="text-3xl font-bold text-green-600">Drapht</h1>
      </div>

      {/* SocketBox in the center */}
      <div id="socket-box" className="flex items-center flex-grow justify-center">
        <SocketBox />
      </div>

      {/* Buttons aligned to the right-center */}
      <div className="flex space-x-1 mt-1">
        {projects.length && <Button
          variant="outline"
          size="icon"
          className="text-gray-300 border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-[#00e676] transition-colors"
          onClick={() => dispatch(setIsProjectHistoryOpen(true))}
        >
          <History className="h-4 w-4" />
        </Button>}  
        <Button
          variant="outline"
          className="text-gray-300 border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-[#00e676] transition-colors"
          onClick={() => dispatch(setIsNewProjectModalOpen(true))}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
        {isLoggedIn && projects[activeProject] && (
          <Button
            variant="outline"
            className="text-gray-300 border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-[#00e676] transition-colors"
            onClick={() => dispatch(setIsGitModalOpen(true))}
          >
          <GitFork className="h-4 w-4 mr-2"/>
            Push to Git
          </Button>
        )}
        {isLoggedIn && <Button
            variant="outline"
            className="text-gray-300 border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-[#00e676] transition-colors"
            onClick={() => dispatch(logout())}
          >
          <LogOut className="h-4 w-4" />
            
          </Button>}
      </div>
    </header>
  );
};

export default Header;
