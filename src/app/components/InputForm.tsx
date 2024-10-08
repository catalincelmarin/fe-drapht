"use client";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { setInput, addMessage, setGeneratedCode, setIsProjectStructureOpen } from '@/app/redux/appSlice';
import CustomTextarea from '@/app/components/CustomTextarea';
import { Button } from "@/app/components/ui/button";
import { Paperclip, Send, FolderTree, Loader2 } from 'lucide-react';  // Added Loader2 for the spinner
import { useState } from 'react';  // Import useState for managing loading state
import { apiDraphtBot, workElement } from '../api/genBotAPI';

const InputForm: React.FC = () => {
  const dispatch = useDispatch();
  const { input, selectedFile, projects, activeProject } = useSelector((state: RootState) => state.app);
  
  const [loading, setLoading] = useState(false);  // Add loading state

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
      }

      // Add the user's input message to the conversation
      dispatch(addMessage({ role: 'user', content: input }));

      setLoading(true);  // Set loading to true when API call starts

      try {
        // Call the API
        const response = await workElement(projects[activeProject].name, data);

        // After receiving the response, set the generated code
        dispatch(addMessage({ role: 'system', content: response.data.message }));
      } catch (error) {
        console.error("Error generating code:", error);
      } finally {
        setLoading(false);  // Set loading to false when API call is complete
      }

      dispatch(setInput(''));
    } else if (input.trim().length > 5){
      const data = {
        role: "user",
        content: input.trim(),
      }

      // Add the user's input message to the conversation
      dispatch(addMessage({ role: 'user', content: input }));

      setLoading(true);  // Set loading to true when API call starts

      try {
        // Call the API
        const response = await apiDraphtBot(projects[activeProject].name, data);

        // After receiving the response, set the generated code
        dispatch(addMessage({ role: 'system', content: response.data.message }));
      } catch (error) {
        console.error("Error generating code:", error);
      } finally {
        setLoading(false);  // Set loading to false when API call is complete
      }

      dispatch(setInput(''));

    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 relative bottom-40">
      <CustomTextarea
        value={input}
        onChange={(e) => dispatch(setInput(e.target.value))}
        placeholder="Describe your code in natural language..."
        className="w-full min-h-[80px] mb-2"
        //disabled={loading}  // Disable textarea while loading
      />
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="text-gray-300 border-[#3a3a3a] bg-[#1e1e1e]"
            disabled={loading}  // Disable button while loading
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
        </div>
        <Button
          type="submit"
          className="bg-[#00e676] hover:bg-[#00c853] text-[#121212] transition-colors"
          disabled={loading || !input.trim()}  // Disable "Send" button when loading or no input
        >
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

export default InputForm;
