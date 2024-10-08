import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Message = { role: string; content: string };

interface Folder {
  type: 'folder';
  name: string;
  children: (Folder | File)[];
  path: string
}

interface File {
  type: 'file';
  name: string;
  scope: "component"|"page"|"schema"|"config"|"other";
  path: string
}

// Combined type for easier use in recursive structures
export type FolderStructure = Folder | File;

type Project = {
  id: number;
  name: string;
  description: string;
  messages: Message[];
  createdAt: string;
};

interface AppState {
  input: string;
  openFolders: string[]
  messages: Message[];
  generatedCode: string;
  gitBranch: string;
  commitMessage: string;
  splitPosition: number;
  projects: Project[];
  activeProject: number;
  isLoggedIn: boolean;
  uploadModal: string | null;
  gitProjects: string[];
  projectStructure: any;
  isProjectStructureOpen: boolean;
  selectedFile: { name: string; path: string; scope?: string; type: string } | null;
  isGitPushing: boolean;
  isGitModalOpen: boolean;
  isProjectHistoryOpen: boolean;
  projectSearchQuery: string;
  isNewProjectModalOpen: boolean;
  newProjectName: string;
  newProjectDescription: string;
  isCreatingProject: boolean;
}

// Define the initial state
const initialState: AppState = {
  input: '',
  messages: [],
  openFolders: [],
  generatedCode: '',
  gitBranch: '',
  commitMessage: '',
  splitPosition: 50,
  projectStructure: {},
  projects: [],
  activeProject: -1,
  isLoggedIn: false,
  gitProjects: [],
  uploadModal: null,
  isProjectStructureOpen: false,
  selectedFile: null,
  isGitPushing: false,
  isGitModalOpen: false,
  isProjectHistoryOpen: false,
  projectSearchQuery: '',
  isNewProjectModalOpen: false,
  newProjectName: '',
  newProjectDescription: '',
  isCreatingProject: false,
};

// Create the slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setUploadModal: (state, action: PayloadAction<string|null>) => {
      state.uploadModal = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setGeneratedCode: (state, action: PayloadAction<string>) => {
      state.generatedCode = action.payload;
    },
    setGitBranch: (state, action: PayloadAction<string>) => {
      state.gitBranch = action.payload;
    },
    setCommitMessage: (state, action: PayloadAction<string>) => {
      state.commitMessage = action.payload;
    },
    setSplitPosition: (state, action: PayloadAction<number>) => {
      state.splitPosition = action.payload;
    },
    addProject: (state, action: PayloadAction<{ name: string; description: string }>) => {
      const newProject = {
        id: state.projects.length + 1,
        name: action.payload.name,
        description: action.payload.description,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      state.projects.push(newProject);
      state.activeProject = newProject.id;
    },
    setActiveProject: (state, action: PayloadAction<number>) => {
      console.log("setActive",action.payload)
      state.activeProject = action.payload;
    },
    updateProjectMessages: (state, action: PayloadAction<{ projectId: number; messages: Message[] }>) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.messages = action.payload.messages;
      }
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setGitProjects: (state, action: PayloadAction<string[]>) => {
      state.gitProjects = action.payload;
    },
    setIsProjectStructureOpen: (state, action: PayloadAction<boolean>) => {
      state.isProjectStructureOpen = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<{ name: string; path: string; scope?: string; type: string } | null>) => {
      console.log(action.payload)
      state.selectedFile = action.payload;
    },
    setIsGitModalOpen: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload)
      state.isGitModalOpen = action.payload;
    },
    setIsGitPushing: (state, action: PayloadAction<boolean>) => {
      state.isGitPushing = action.payload;
    },
    setIsProjectHistoryOpen: (state, action: PayloadAction<boolean>) => {
      state.isProjectHistoryOpen = action.payload;
    },
    setProjectSearchQuery: (state, action: PayloadAction<string>) => {
      state.projectSearchQuery = action.payload;
    },
    setIsNewProjectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNewProjectModalOpen = action.payload;
    },
    setNewProjectName: (state, action: PayloadAction<string>) => {
      state.newProjectName = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      
      state.projects = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      
      state.messages = action.payload;
    },
    setProjectStructure: (state, action: PayloadAction<FolderStructure>) => {
      
      state.projectStructure = action.payload;
    },
    setOpenFolders: (state, action: PayloadAction<string[]>) => {
      
      state.openFolders = action.payload;
    },
    setNewProjectDescription: (state, action: PayloadAction<string>) => {
      state.newProjectDescription = action.payload;
    },
    setIsCreatingProject: (state, action: PayloadAction<boolean>) => {
      state.isCreatingProject = action.payload;
    },
  },
});

// Export the actions
export const {
  setInput,
  addMessage,
  setMessages,
  setUploadModal,
  setGeneratedCode,
  setGitBranch,
  setCommitMessage,
  setSplitPosition,
  addProject,
  setActiveProject,
  updateProjectMessages,
  setIsLoggedIn,
  setGitProjects,
  setIsGitModalOpen,
  setIsProjectStructureOpen,
  setOpenFolders,
  setSelectedFile,
  setIsGitPushing,
  setProjects,
  setProjectStructure,
  setIsProjectHistoryOpen,
  setProjectSearchQuery,
  setIsNewProjectModalOpen,
  setNewProjectName,
  setNewProjectDescription,
  setIsCreatingProject,
} = appSlice.actions;

// Export the reducer
export default appSlice.reducer;

