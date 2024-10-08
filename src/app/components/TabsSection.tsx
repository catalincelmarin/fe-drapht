"use client";

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Eye, Code, RefreshCw, Save, Monitor } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import Ide from './ui/ide';
import { bootProject, saveFile, workElement } from '../api/genBotAPI';

import ErrorLog from './ErrorLog';
import { io } from 'socket.io-client';

const TabsSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<string>('preview'); // Track active tab
  const { generatedCode, activeProject, selectedFile,projects } = useSelector((state: RootState) => state.app);
  const username = useSelector((state: RootState) => state.auth.user.username);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading,setLoading] = useState(false)
  const [problems,setProblems] = useState("")

  useEffect(()=>{
    
    let socket = io(process.env.NEXT_PUBLIC_API_URL, { withCredentials: true , auth: {
      token: token }});
      
    socket.on("rebuild",(message)=>{
      reloadIframe()
    })
    socket.on("build",(message)=>{
      const verify = JSON.parse(message);
      console.log("build",verify)
      setProblems("");
      console.log("build",activeProject,projects[activeProject].name)
      if(!isNaN(activeProject) && verify.success && projects[activeProject].name){
        
        setLoading(false)
      const ifr = document.createElement("iframe");
        ifr.id = "remover";
        ifr.className = "w-full flex-1 border border-[#3a3a3a] rounded";
        ifr.src = `${process.env.NEXT_PUBLIC_DOMAIN_PROTOCOL}://${projects[activeProject].name}.${username}.${process.env.NEXT_PUBLIC_DOMAIN}`;
        const iframe = document.querySelector("#parentOfIframe iframe");
        console.log("refreshing")
        if (iframe) {
          
          iframe?.parentElement?.removeChild(iframe);

          setTimeout(() => {
            ifr.addEventListener('load', function() {
              setLoading(false)
            });
            document.querySelector("#parentOfIframe")?.appendChild(ifr);
            
          }, 3000);
        }
      } else {
          setLoading(false);
          setProblems(verify.output)
      }
    })
    
    setActiveTab("preview")
  },[])
  useEffect(() => {
    if(activeProject > -1) {
      if (activeTab === 'render') {
        reloadIframe();
      }
    }
  }, [activeProject]);

  const fixAttempt = (error: string,file: string) => {
    if (error.trim() && file.trim()) {
      const data = {
        prompt: "Fix this " + error,
        file: {
          name: file.split("/")[file.split("/").length -1],
          path: file.replace("./","/fe/").split("/").slice(0,-1).join("/"),
          scope: "unknown"
        }
      }

      setLoading(true);

        workElement(projects[activeProject].name, data).then(response=>{
          setLoading(false);
          console.log(response);
        }).catch(err=>{
          console.log(err);
          setLoading(false);
        });
      }
  } 

  const reloadIframe = () => {
    if(projects[activeProject] && !loading) {
      setLoading(true);
      setProblems("");
      bootProject(projects[activeProject].name,null).then(()=>{
        
        
      }).catch(err=>setLoading(false))
    }
    
  };

  const reloadPreview= () => {
    if(projects[activeProject]) {
      setLoading(true)
      console.log(projects[activeProject].name)
      
      if(!isNaN(activeProject) && projects[activeProject].name){
        console.log(activeProject,projects[activeProject])  
        
       const ifr = document.createElement("iframe");
        ifr.id = "removerPreview";
        ifr.className = "w-full flex-1 border border-[#3a3a3a] rounded";
        ifr.src = `${process.env.NEXT_PUBLIC_API_URL}/api/genbot/preview/${projects[activeProject].name}/${username}`;
        console.log(document.querySelector('#parentOfPreview'))
        const iframe = document.querySelector('#parentOfPreview iframe');
        
        if (iframe) {
          
          iframe?.parentElement?.removeChild(iframe);

          setTimeout(() => {
            
            ifr.addEventListener('load', function() {
              console.log("Xx")
              setLoading(false)
            });
            document.querySelector("#parentOfPreview")?.appendChild(ifr);
            
          }, 3000);
        }
      }
    }
    
  };


  const handleTabChange = (value: string) => {
    setActiveTab(value); // Update active tab
  };


  return (
    <Tabs defaultValue="preview" className="flex-1 flex flex-col h-full" onValueChange={handleTabChange}>
      <div className="flex justify-between items-center p-4 border-b border-[#2a2a2a]">
        <TabsList className="bg-[#1a1a1a]">
          <TabsTrigger value="render" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Eye className="h-4 w-4 mr-2" />
            Render
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Monitor className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center space-x-2">
          
            <Button
              variant="outline"
              size="sm"
              className="text-gray-300 border-[#2a2a2a] bg-[#1a1a1a]"
              onClick={activeTab == "render" ? reloadIframe : reloadPreview}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          
          
        </div>
      </div>

      <TabsContent value="render" className="relative flex-1 bg-[#1a1a1a] p-4 overflow-hidden">
        {projects[activeProject] && <div id="parentOfIframe" className="bg-[#2a2a2a] p-4 rounded-md h-full flex flex-col">
          
          <iframe
            ref={iframeRef}
            src={`${process.env.NEXT_PUBLIC_DOMAIN_PROTOCOL}://${projects[activeProject].name}.${username}.${process.env.NEXT_PUBLIC_DOMAIN}`}
            className="w-full flex-1 border border-[#3a3a3a] rounded"
            title="Local Render"
          />
        </div>}
        {loading && <div
          id="iframeOverlay"
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
        >
          <div className="loader border-t-transparent border-solid border-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
        </div>}
        {problems !== "" && <div
          id="iframeOverlay2"
          className="absolute inset-0 bg-[#1a1a1a] text-slate-800 overflow-y-auto flex items-center justify-center z-10"
        >
          <ErrorLog rawLog={problems} reloader={reloadIframe} fixer={fixAttempt}/>
        </div>}
      </TabsContent>

      <TabsContent value="preview" className="relative flex-1 bg-[#1a1a1a] p-4 overflow-hidden">
        {projects[activeProject] && <div id="parentOfPreview" className="bg-[#2a2a2a] p-4 rounded-md h-full flex flex-col">
          
          <iframe
            ref={prevRef}
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/genbot/preview/${projects[activeProject].name}/${username}`}
            className="w-full flex-1 border border-[#3a3a3a] rounded"
            id="removerPreview"
            title="HTML Preview"
          />
        </div>}
        {loading && <div
          id="iframeOverlay"
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
        >
          <div className="loader border-t-transparent border-solid border-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
        </div>}
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
