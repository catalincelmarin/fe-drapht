"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Code, Bot, FolderTree, Save, Brush } from 'lucide-react';  // Added Brush icon for canvas tab
import { Button } from "@/app/components/ui/button";
import Ide from './ui/ide';
import { saveFile } from '../api/genBotAPI';
import MessagesArea from './MessagesArea';  // Import your MessagesArea component
import InputForm from './InputForm';        // Import your InputForm component
import { setIsProjectStructureOpen } from '../redux/appSlice';
import CanvasArea from './CanvasArea';  // Import your CanvasArea component
import ChatLayout from './MessagesArea';

const TabsSection: React.FC = () => {
  const { generatedCode, activeProject,isProjectStructureOpen, selectedFile, projects, splitPosition } = useSelector((state: RootState) => state.app);
  const [activeTab, setActiveTab] = useState<string>('code'); // Track active tab
  const dispatch = useDispatch();
  const getLang = () => {
    if (selectedFile) {
      const ext = selectedFile?.name.split(".");
      if (ext) {
        return ext[ext.length - 1];
      }
      return "ts";
    }
    return "ts";
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value); // Update active tab
  };

  const handleSave = () => {
    // Save the code logic
    if (selectedFile && activeProject > -1) {
      saveFile(projects[activeProject].name, { name: selectedFile?.name, path: selectedFile?.path, content: generatedCode })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <Tabs defaultValue="ai_prompt" className="flex-1 flex flex-col h-full" onValueChange={handleTabChange}>
      <div className="flex justify-between items-center p-4 border-b border-[#2a2a2a]">
        <div className='flex'>
        <Button
            variant="outline"
            size="icon"
            className="text-gray-300 border-[#3a3a3a] bg-[#1e1e1e] hover:bg-green-500"
            onClick={() => dispatch(setIsProjectStructureOpen(!isProjectStructureOpen))} // Toggle project structure
            
          >
            <FolderTree className="h-4 w-4" />
          </Button>
          
            
            {activeTab === 'code' && (
              <Button
                variant="outline"
                size="icon"
                className="text-gray-300 py-4 ml-3 border-[#2a2a2a] bg-[#1a1a1a] hover:bg-green-500"
                onClick={handleSave}
              >
                <Save className='h-4 w-4'/>
              </Button>
            )}
          
        </div>
        <TabsList className="bg-[#1a1a1a]">
          <TabsTrigger value="code" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Code className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
          <TabsTrigger value="ai_prompt" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Bot className="h-4 w-4 mr-2" />
            AI Prompting
          </TabsTrigger>
          <TabsTrigger value="canvas" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Brush className="h-4 w-4 mr-2" />
            Canvas
          </TabsTrigger>
        </TabsList>
       
      </div>

      <TabsContent value="code" className="flex-1 bg-[#282c34] p-1 overflow-auto">
        <pre className="text-gray-300  whitespace-pre-wrap">
          <Ide myCode={generatedCode} lang={getLang()} />
        </pre>
      </TabsContent>

      <TabsContent value="ai_prompt" className="relative flex-1 bg-[#1a1a1a] overflow-hidden">
        {/* AI Prompting Section */}

          <div className="h-full flex flex-col">
           <ChatLayout />
          </div>

      </TabsContent>

      <TabsContent value="canvas" className="relative flex-1 bg-[#1a1a1a] overflow-hidden">
        {/* Canvas Drawing Section */}
        <CanvasArea file={selectedFile?.name || ''} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
