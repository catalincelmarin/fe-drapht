"use client";

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { setIsProjectStructureOpen, setMessages, setSelectedFile } from '../redux/appSlice';
import { Bot, Monitor, X, Paperclip, Send, Loader2 } from 'lucide-react';
import CustomTextarea from '@/app/components/CustomTextarea';
import { apiDraphtBot, fetchProject, workElement } from '../api/genBotAPI';
import { setInput, addMessage } from '@/app/redux/appSlice';

// MessagesArea component
const MessagesArea: React.FC = () => {
  const { messages } = useSelector((state: RootState) => state.app);
  const { selectedFile } = useSelector((state: RootState) => state.app);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeBot, setActiveBot] = useState("draphtBot");
  const dispatch = useDispatch();
  const { activeProject, projects } = useSelector((state: RootState) => state.app);

  const handleBotSwitch = (value: string) => {
    setActiveBot(value);
  };
  useEffect(()=>{
    
    if(selectedFile === null){
      fetchProject(projects[activeProject].name).then(({data}) => {
        console.log(data.messages)
          dispatch(setMessages(data.messages))
      }).catch(err=>console.log(err))
    }
  },[selectedFile])

  useEffect(() => {
    console.log("changed",messages)
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });

    }
  }, [messages]);

  return (
    <Tabs defaultValue="draphtBot" className="flex-1 flex flex-col h-full" onValueChange={handleBotSwitch}>
      <div className="flex justify-between items-center p-4 border-b border-[#2a2a2a]">
        <TabsList className="bg-[#1a1a1a]">
          <TabsTrigger value="draphtBot" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Bot className="h-4 w-4 mr-2" />
            DraphtBot
          </TabsTrigger>
          <TabsTrigger value="designBot" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#00e676]">
            <Monitor className="h-4 w-4 mr-2" />
            DesignBot
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="draphtBot">
      <ScrollArea className="flex-1 px-4 overflow-y-auto"  style={{height:"58vh"}}>
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-[#3a3a3a]' : 'bg-[#2a2a2a]'}`}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </ScrollArea>
        <h2 className="text font-bold mb-2 text-gray-600 flex items-center">
          {selectedFile !== null ? (
            <div id="operate-file" className='flex items-center justify-between w-full'>
              <span className='px-3'>{selectedFile.path + "/" + selectedFile.name}</span>
              <Button className="bg-transparent text-gray-600 px-3 rounded-full flex items-center transition-colors hover:text-red-400 hover:bg-transparent">
                <X className="h-5 w-5" onClick={() => dispatch(setSelectedFile(null))} />
              </Button>
            </div>
          ) : (
            <div id="alter-conversation" className='flex items-center justify-center w-full p-3 space-x-2  text-green-500'>
              <Bot className="h-5 w-5" />
              <span>DraphtBot</span>
            </div>
          )}
        </h2>
        
        
      </TabsContent>

      <TabsContent value="designBot">
        <h2 className="text font-bold mb-2 text-gray-600 flex items-center space-x-2">
          <div id="design-bot-title" className='flex items-center justify-center w-full p-3 space-x-2 text-gray-600'>
            <Monitor className="h-5 w-5" />
            <span>DesignBot</span>
          </div>
        </h2>

        <ScrollArea className="flex-1 pr-4 mb-4 overflow-y-auto">
          <div className="text-center text-gray-400">
            DesignBot conversation or interaction section.
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

// InputForm component
const InputForm: React.FC = () => {
  const dispatch = useDispatch();
  const { input, selectedFile, projects, activeProject } = useSelector((state: RootState) => state.app);
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && selectedFile) {
      const data = {
        prompt: input.trim(),
        file: {
          name: selectedFile.name,
          path: selectedFile.path,
          scope: selectedFile.scope
        }
      };

      dispatch(addMessage({ role: 'user', content: input }));
      setLoading(true);

      try {
        const response = await workElement(projects[activeProject].name, data);
        dispatch(addMessage({ role: 'system', content: response.data.message }));
      } catch (error) {
        console.error("Error generating code:", error);
      } finally {
        setLoading(false);
      }

      dispatch(setInput(''));
    } else if (input.trim().length > 5){
      const data = { role: "user", content: input.trim() };

      dispatch(addMessage({ role: 'user', content: input }));
      setLoading(true);

      try {
        const response = await apiDraphtBot(projects[activeProject].name, data);
        dispatch(addMessage({ role: 'system', content: response.data.message }));
      } catch (error) {
        console.error("Error generating code:", error);
      } finally {
        setLoading(false);
      }

      dispatch(setInput(''));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4">
      <CustomTextarea
        value={input}
        onChange={(e) => dispatch(setInput(e.target.value))}
        placeholder="Describe your code in natural language..."
        className="w-full min-h-[80px] mb-2"
      />
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="text-gray-300 border-[#3a3a3a] bg-[#1e1e1e]" disabled={loading}>
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        <Button type="submit" className="bg-[#00e676] hover:bg-[#00c853] text-[#121212] transition-colors" disabled={loading || !input.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Combined Main Component
const ChatLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessagesArea />
      </div>
      <div className="relative">
        <InputForm />
      </div>
    </div>
  );
};

export default ChatLayout;
