"use client";

import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { setSplitPosition, setProjects, setIsNewProjectModalOpen } from '@/app/redux/appSlice';
import { fetchProjects } from '@/app/api/genBotAPI'; // Import the fetchProjects function
import { AxiosResponse } from 'axios';
import { Folder, PlusCircle, Rocket } from 'lucide-react'; // Importing an icon from lucide-react

// Import custom components
import Header from '@/app/components/Header';
import MessagesArea from '@/app/components/MessagesArea';
import InputForm from '@/app/components/InputForm';
import TabsSection from '@/app/components/TabsSection';
import ProjectStructure from '@/app/components/ProjectStructure';
import ProjectsHistory from '@/app/components/ProjectsHistory';
import NewProjectModal from '@/app/components/NewProjectModal';
import GitModal from '@/app/components/GitModal';
import { Button } from '@/app/components/ui/button'; // Import Button UI component
import LeftTabs from './components/LeftTabs';
import LoadingScreen from './components/LoadingScreen';
import { loadTokenFromStorage } from './redux/auth/authSlice';


const App: React.FC = () => {
  const dispatch = useDispatch();
  const { splitPosition, isCreatingProject,isProjectStructureOpen, isProjectHistoryOpen, activeProject, projects } = useSelector((state: RootState) => state.app);
  const { token,user } = useSelector((state: RootState) => state.auth);
  const splitRef = useRef(null);

  useEffect(()=>{
    console.log("user")
  })

  // Fetch Projects on Initial Load
  useEffect(() => {
    fetchProjects()
      .then((response: AxiosResponse<{ projects: string[] }>) => {
        // Mapping the projects to the desired structure
        
        dispatch(
          setProjects(
            response.data.projects.map((el: string, index: number) => {
              return {
                id: index, // Project IDs start from 1
                name: el,
                description: `Project ${el}`,
                messages: [],
                createdAt: new Date('2023-05-01').toISOString(),
              };
            })
          )
        );
      })
      .catch((err) => {
        console.log('Error fetching projects:', err);
      });
      
        // Load token from localStorage when the app starts
      
    
  }, [dispatch]);

  // Split pane resize logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (splitRef.current) {
      const newPosition = (e.clientX / splitRef.current.offsetWidth) * 100;
      dispatch(setSplitPosition(newPosition));
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Render grid of projects when activeProject is less than 1
  if (activeProject < 0) {
    return (
      <>
        <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col">
          {/* Header Section */}
          <Header />

          {/* Centered Project List */}
          {isCreatingProject ? <LoadingScreen /> :
          <div className="flex-1 flex items-center justify-center">
            <div className={`grid grid-cols-${projects.length  < 5 ? 1 : (projects.length % 3 === 0 ? 3 : 4)} gap-6`}>
              {projects.map((project) => {
                console.log(project)
                return (<Button
                  key={project.id}
                  className="p-6 bg-green-600 hover:bg-green-700 text-slate-100 text-lg rounded-lg shadow-lg transition-colors flex items-center space-x-2"
                  onClick={() => {
                    if(project.name.toLocaleLowerCase() == "new") {
                      dispatch(setIsNewProjectModalOpen(true))  
                    } else {
                      dispatch({ type: 'app/setActiveProject', payload: project.id })
                    }
                  }}
                >
                  {/* Adding an icon to the button */}
                  {project?.name && project?.name?.toLowerCase() == "new" ? (<PlusCircle  className="w-6 h-6 text-slate-100" />)
                :(<Rocket  className="w-6 h-6 text-slate-100" />)}
                  <span>{project?.name}</span>
                </Button>)
              })}
            </div>
          </div>}
          <NewProjectModal />
        </div>

      </>
    );
  }

  // Render the full app when activeProject is set
  return (
    <>
      <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col">
        {/* Header Section */}
        <Header />

        <div className="flex-1 flex relative" ref={splitRef}>
          <div className="absolute inset-0 flex">
             
            <>
          {isProjectStructureOpen && <ProjectStructure />}
            {/* Left Pane */}
            <LeftTabs />

            {/* Split Resizer */}
            <div
              className="w-2 bg-[#2a2a2a] cursor-col-resize hover:bg-[#00e676] transition-colors"
              onMouseDown={handleMouseDown}
            />

            {/* Right Pane (Project Structure and Tabs) */}
            <div style={{ width: `${100 - splitPosition}%` }} className="h-full flex">
              {/* Project Structure */}
              

              {/* Tabs Section */}
              <TabsSection />
            </div>
            </>
          </div>
        </div>

        {/* Modals */}
        
        <GitModal />
        <NewProjectModal />
        {isProjectHistoryOpen && <ProjectsHistory />}
      </div>
    </>
  );
};

export default App;
