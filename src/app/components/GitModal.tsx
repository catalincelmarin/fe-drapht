"use client";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { setIsGitModalOpen, setGitBranch, setCommitMessage, setIsGitPushing } from '@/app/redux/appSlice';
import { Button } from '@/app/components/ui/button';
import { Loader2, GitBranch } from 'lucide-react';
import CustomInput from '@/app/components/CustomInput';
import { executeGitCommand } from '../api/genBotAPI';

const GitModal: React.FC = () => {
  const dispatch = useDispatch();
  const { gitBranch, commitMessage,projects,activeProject, isGitPushing,isGitModalOpen } = useSelector((state: RootState) => state.app);

  const handleGitPush = () => {
    dispatch(setIsGitPushing(true));
    
      executeGitCommand("push",{project: projects[activeProject].name}).then(({data})=>{
        dispatch(setIsGitPushing(false));
      dispatch(setIsGitModalOpen(false));  // Close modal after pushing
      dispatch(setGitBranch(''));  // Reset the form
      dispatch(setCommitMessage(''));
      }).catch(err=> {
        console.log(err)
      })
    
    
  };

  return (
    <dialog className="bg-[#1a1a1a] text-gray-100 rounded-lg p-6 w-96" open={isGitModalOpen}>
      
      <form method="dialog" className="space-y-4 flex justify-center">
        {/* <div>
          <label htmlFor="gitBranch" className="block text-sm font-medium mb-1">Branch Name</label>
          <CustomInput
            
            value={gitBranch}
            onChange={(e) => dispatch(setGitBranch(e.target.value))}
            placeholder="Enter branch name"
          />
        </div>
        <div>
          <label htmlFor="commitMessage" className="block text-sm font-medium mb-1">Commit Message</label>
          <CustomInput
            
            value={commitMessage}
            onChange={(e) => dispatch(setCommitMessage(e.target.value))}
            placeholder="Enter commit message"
          />
        </div> */}
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => dispatch(setIsGitModalOpen(false))}  // Close the modal
            variant="outline"
            className="border-[#444] bg-[#2a2a2a] hover:bg-[#3a3a3a]"
            disabled={isGitPushing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGitPush}
            className="bg-[#00e676] hover:bg-[#00c853] text-[#121212]"
            disabled={isGitPushing}
          >
            {isGitPushing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pushing...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Push to Git
              </>
            )}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

export default GitModal;

