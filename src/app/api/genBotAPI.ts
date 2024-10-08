import axios, { AxiosError, AxiosResponse } from 'axios';
import { FolderStructure, setProjects } from '../redux/appSlice';
import store from '../redux/store';
import { jwtDecode } from "jwt-decode";
import { logout } from '../redux/auth/authSlice';

export const isTokenExpired = (token) => {
  if (!token) return true;  // If there's no token, it's "expired" by default

  try {
    const decodedToken = jwtDecode(token);
    
    if (!decodedToken.exp) return true; // If the token doesn't have an expiration, consider it expired
    
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime;  // Compare token expiration time with current time
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;  // If token decoding fails, consider it expired
  }
};
export interface Message {
    message: string,
    status: string
}

interface LoadFile {
    id?: string,
    name?: string,
    path?: string,
    scope?: string,
    messages?: string[],
    timestamp?: Date,
    content?: string,
    isNew?: boolean | false
    isFolder?: boolean | false
}

interface UploadFile {
    id?: string,
    name?: string,
    path?: string,
    scope?: string,
    messages?: string[],
    timestamp?: Date,
    content?: string
}



interface NewProject {
    project: string,
    prompt: string
}

interface BotMessage {
  role: string | "user" | "assistant",
  content: string
}
// Define the API types
interface ElementData {
  [key: string]: any;
}

interface WorkFile {
    file: LoadFile,
    prompt: string
}

interface GitCommandData {
  [key: string]: any;
}

interface ProjectResponse {
    projects: string[];
}

// Axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/genbot`,
  headers: {
    'Content-Type': 'application/json',
    
  },
})

api.interceptors.request.use(
    (config) => {
      
      const token = store.getState().auth.token; // Assuming you have such a structure
      if (isTokenExpired(token)) {
        store.dispatch(logout());
        window.location.href = "/";  // Redirect to login
        return Promise.reject("Token expirzd");  // Reject the request
      }
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

// Project APIs
export const fetchProjects = async (): Promise<AxiosResponse<ProjectResponse>> => {
  return await api.get('/projects')
};

export const fetchStructure = async (project: string): Promise<AxiosResponse<FolderStructure>> => {
    return await api.get(`/${project}/tree`)
};


export const fetchFile = async (project: string, file: LoadFile): Promise<AxiosResponse<LoadFile>> => {
    return await api.post(`/${project}/file/load`,file)
};

export const removeFile = async (project: string, file: LoadFile): Promise<AxiosResponse<LoadFile>> => {
  return await api.post(`/${project}/file/delete`,file)
};
export const moveFile = async (project: string, operation: any): Promise<AxiosResponse<LoadFile>> => {
  return await api.post(`/${project}/file/move`,operation)
};

export const saveFile = async (project: string, file: LoadFile): Promise<AxiosResponse<LoadFile>> => {
    return await api.post(`/${project}/file/save`,file)
};

export const apiDraphtBot = async (project: string, data: BotMessage): Promise<AxiosResponse<Message>> => {
  return await api.post(`/drapht/${project}`,data)
};

export const postSketch = async (
  project: string,
  file: LoadFile,
  base64Image: string, // The base64 encoded image
): Promise<AxiosResponse<LoadFile>> => {
  let formData = null;

  if (base64Image) {
    formData = {image: base64Image}; // Append the base64 encoded image
  }

  return await api.post(`/${project}/sketch`, formData, {
   
  });
};

  
export const createFile = async (
    project: string,
    file: LoadFile,
    attachedFile?: File | null
  ): Promise<AxiosResponse<LoadFile>> => {
    const formData = new FormData();
  
    if (file.name) {
      formData.append('name', file.name);
    }
  
    if (file.path) {
      formData.append('path', file.path);
    }
  
    if (attachedFile) {
      formData.append('file', attachedFile); // Attach the file if available
    }
  
    return await api.post(`/${project}/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

// Fetch components for a specific project
export const fetchComponents = async (project: string): Promise<any> => {
  return await api.get(`/components/${project}`);
};

// Fetch pages for a specific project
export const fetchPages = async (project: string): Promise<any> => {
  return await api.get(`/pages/${project}`);
};

// Fetch logs
export const fetchLogs = async (): Promise<any> => {
  return await api.get('/logs');
};

export const fetchProject = async (project: any): Promise<any> => {
  return await api.get(`/projects/${project}`);
};

// Bot Operations
export const bootProject = async (
  project: string, 
  prompt: NewProject | null, 
  sampleFile?: File | null  // Added optional sampleFile parameter
): Promise<AxiosResponse<Message>> => {
  const formData = new FormData();
  if(project !== "new" && prompt === null) {
    console.log("CALLLING X")
    return await api.post(`/boot/${project}`,prompt);
  } else {
    if(prompt !== null) {  
      formData.append('prompt', JSON.stringify(prompt));
    }
    if (sampleFile) {
      formData.append('sample_photo', sampleFile);  // Add the sample file to the formData
    }
    console.log("CALLLING ")
    return await api.post(`/boot/${project}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Set content type to multipart
      },
    
    });
  }
};

// Element Operations (alter, create, generate)
export const workElement = async (project: string, data: WorkFile): Promise<any> => {
  return await api.post(`/${project}/file/work`, data);
};

export const createElement = async (element: string, data: ElementData): Promise<any> => {
  return await api.post(`/create/${element}`, data);
};

export const generateElement = async (element: string, data: ElementData): Promise<any> => {
  return await api.post(`/generate/${element}`, data);
};

// Git Operations (pull, push, invite, remove)
export const executeGitCommand = async (command: string, data: GitCommandData): Promise<any> => {
  return await api.post(`/git/${command}`, data);
};
