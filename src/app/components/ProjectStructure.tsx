"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';
import FileTreeItem from '@/app/components/FileTreeItem';
import { setSelectedFile, setGeneratedCode, setOpenFolders,addMessage, setProjectStructure, FolderStructure, Message, setUploadModal, setMessages } from '@/app/redux/appSlice';
import { useEffect, useState } from 'react';
import { fetchFile, fetchStructure, moveFile, removeFile } from '../api/genBotAPI';
import { AxiosResponse } from 'axios';
import FileModal from './FileModal';
import { RefreshCw } from 'lucide-react'; // Refresh icon

// Custom style to hide scrollbars
const hiddenScrollStyle = {
  overflow: 'hidden',
  scrollbarWidth: 'none',  // For Firefox
  msOverflowStyle: 'none',  // For IE and Edge
};

const ProjectStructure: React.FC = () => {
  const dispatch = useDispatch();
  const { projectStructure, uploadModal,openFolders, selectedFile, activeProject, projects } = useSelector((state: RootState) => state.app);
  
  // State to store opened folders


  useEffect(() => {
    const prj = projects.find((p) => p.id === activeProject)?.name;
    if (prj !== undefined) {
      fetchStructure(prj)
        .then((response: AxiosResponse<FolderStructure>) => {
          dispatch(setProjectStructure(response.data));
        }).catch(err => {
          console.log(err);
        });
    }
  }, [activeProject]);

  const handleConfirmFileSelection = () => {
    if (selectedFile && activeProject > -1) {
      dispatch(setMessages([]));
      fetchFile(projects[activeProject].name, { name: selectedFile.name, path: selectedFile.path })
        .then((response) => {
          dispatch(setGeneratedCode(response.data.content + ""));
          response.data.messages?.map((msg: any) => {
            dispatch(addMessage(msg));
          });
        }).catch(err => {
          console.log(err);
        });
    }
  };

  const handleCloseModal = () => {    
    dispatch(setUploadModal(null)); // Close the modal
  };
  useEffect(()=>{
    console.log(openFolders)
  },[openFolders])
  // Store currently opened folders
  

  // Refresh project structure and restore opened folders
  const handleRefresh = () => {
    const prj = projects.find((p) => p.id === activeProject)?.name;
    if (prj !== undefined) {
      fetchStructure(prj)
        .then((response: AxiosResponse<any>) => {
          
          // Restore opened folders after re-fetch
          response.data.children.forEach(folder => {
            if (openFolders.includes(folder.path)) {
              folder.isOpen = true;
            }
          });
          dispatch(setProjectStructure(response.data));
        }).catch(err => {
          console.log(err);
        });
    }
  };

  const handleDelete = () => {
    removeFile(projects[activeProject].name,selectedFile).then(({data})=>{
      handleRefresh()
    }).catch(err=>{
      console.log(err)
    })
  }

  const handleMoveFile = (sourcePath: string, destinationPath: string) => {
    // Logic to move the file from sourcePath to destinationPath
    const operation = {src: sourcePath, dst: destinationPath};
    moveFile(projects[activeProject].name,operation).then(({data})=>{
      handleRefresh()
    }).catch(err=>console.log(err))
  };

  useEffect(()=>{
    handleRefresh()
  },[uploadModal])

  return (
    <div className="w-96 bg-[#1a1a1a] border-r border-[#2a2a2a] overflow-hidden flex flex-col">
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-[#00e676]">Project Structure</h3>
          <Button variant="ghost" className="p-2 bg-transparent hover:bg-transparent" onClick={handleRefresh}>
            <RefreshCw className="text-[#00e676] w-4 h-4  hover:text-gray-100" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-15rem)] custom-scrollbar scrollbar-thumb-[#2a2a2a] scrollbar-track-[#1a1a1a]">

          <div>
            {uploadModal !== null && (
              <FileModal isModalOpen={uploadModal !== null} closeModal={handleCloseModal} folder={uploadModal} />
            )}
          </div>
          {/* Render the file tree */}
          <FileTreeItem
            item={projectStructure}
            onSelectFile={(file) => dispatch(setSelectedFile(file))}
            selectedFile={selectedFile}
            onDeleteItem={handleDelete}
            onMoveFile={handleMoveFile}
          />
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-[#2a2a2a] bg-[#1a1a1a] sticky bottom-0">
        <Button
          onClick={handleConfirmFileSelection}
          disabled={!selectedFile || selectedFile.type === "folder"}
          className="w-full bg-[#00e676] hover:bg-[#00c853] text-[#121212]"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default ProjectStructure;
