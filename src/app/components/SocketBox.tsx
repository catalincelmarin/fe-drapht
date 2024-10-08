"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { addProject, setActiveProject, setIsCreatingProject, setProjects } from '../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchProjects } from '../api/genBotAPI';
import { AxiosResponse } from 'axios';

interface SocketProps {
    onMessage: (param: string) => void;
}

// Define the type for the socket
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const SocketBox: React.FC = () => {
  const [message, setMessage] = useState<string>('connecting...');
  const [connected, setConnected] = useState<boolean>(false);
  const [animateMessage, setAnimateMessage] = useState<boolean>(false);
  const { projects, activeProject} = useSelector((state: RootState) => state.app);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch()
  useEffect(() => {
    // Initialize the socket connection
    socket = io(process.env.NEXT_PUBLIC_API_URL, { withCredentials: true , auth: {
      token: token }});

    // Listen for 'connect' event to verify connection
    socket.on('connect', () => {
      setConnected(true);
      console.log("projects",projects)
      setMessage("connected")
      console.log('Connected to the server');
    });
    socket.on('launch', (data) => {
      
      fetchProjects()
      .then((response: AxiosResponse<{ projects: string[] }>) => {
        // Mapping the projects to the desired structure
        const loadProjects = response.data.projects.map((el: string, index: number) => {
          return {
            id: index, // Project IDs start from 1
            name: el,
            description: `Project ${el}`,
            messages: [],
            createdAt: new Date('2023-05-01').toISOString(),
          };
        })
        

        dispatch(
          setProjects(
          loadProjects    
          )
        );
        
        dispatch(setActiveProject(response.data.projects.indexOf(data)))
        dispatch(setIsCreatingProject(false))
      })
      .catch((err) => {
        console.log('Error fetching projects:', err);
      });
      
    

      
      
    });
    
    // Listen for the 'message' event from the server
    socket.on('message', (data: string | object) => {
      if(typeof data == "object"){
        
        if(data["output"]) {
          setMessage(data["output"])
        } else if(data["message"]) {
          setMessage(data["message"])
        }
      } else {
        setMessage(data);
      }
      
      console.log('Message received:', data, typeof data);
      
      // Trigger animation when a new message is received
      setAnimateMessage(true);
      setTimeout(() => {
        setAnimateMessage(false); // Reset animation after it plays
      }, 1000); // Animation duration (1s in this case)
    });

    // Clean up the connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
      
    };
  }, []);

  return (
    <div className={`bg-[#1a1a1a] w-1/2 text-gray-300 ${message.slice(-3) === "..." && "flash-border"} border-[#2a2a2a] border-2 rounded-lg flex items-center justify-center px-4 py-2 transition-all`}>
      {connected ? (
        <p
          className={`text-green-600 font-semibold ${animateMessage ? 'fade-in' : ''}`}
        >
          {message ? message : "waiting..."}
        </p>
      ) : (
        <p className="text-red-600 font-semibold">Disconnected</p>
      )}
    </div>
  );
};

export default SocketBox;
