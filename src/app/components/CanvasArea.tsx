"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/app/components/ui/button";  // Assuming you have a Button component in your UI kit
import { Save, Undo2, CheckSquare, Type, PenTool, Eraser, X } from 'lucide-react'; // Icons from Lucide
import { postSketch } from '../api/genBotAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface CanvasAreaProps {
  file: string;  // You can pass the file if needed
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ file }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);  // Add a reference for the input element
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);  // History of drawings for undo
  const [currentAction, setCurrentAction] = useState<'draw' | 'text' | 'erase'>('draw'); // Toggle between draw, text, and erase
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [textValue, setTextValue] = useState(''); // Hold text input value
  const [textPosition, setTextPosition] = useState<{ x: number, y: number } | null>(null); // Text position
  const { activeProject, projects} = useSelector((state: RootState) => state.app);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeCanvas = () => {
          canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
          canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
          ctx.fillStyle = '#1a1a1a';  // Dark background like a blackboard
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        
        // Resize the canvas when the window is resized
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || currentAction === 'text') return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      setIsDrawing(true);
      ctx.strokeStyle = currentAction === 'erase' ? '#1a1a1a' : '#00e676';  // White for eraser, green for draw
      ctx.lineWidth = currentAction === 'erase' ? 20 : 5;  // Thicker line for eraser
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      // Save the current canvas state before drawing (for undo functionality)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setDrawHistory(prev => [...prev, imageData]);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!isDrawing || !canvas || currentAction === 'text') return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas && activeProject > -1) {
      // Convert the canvas content to base64-encoded image (in PNG format)
      const imageBase64 = canvas.toDataURL("image/png").split(",")[1]; // Remove the prefix 'data:image/png;base64,'
  
      // Prepare the file information
      const file = {
        name: "canvas-drawing.png", // You can customize the filename if needed
        path: "/some/path", // Adjust the path if necessary
      };
  
      // Call the postSketch function to upload the image
      postSketch(projects[activeProject].name, file, imageBase64)
        .then(response => {
          console.log("Sketch uploaded successfully:", response.data);
        })
        .catch(error => {
          console.error("Error uploading sketch:", error);
        });
    }
  };
  

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (canvas && drawHistory.length > 0) {
      const ctx = canvas.getContext('2d');
      const previousImageData = drawHistory.pop();  // Get the last state
      if (previousImageData && ctx) {
        ctx.putImageData(previousImageData, 0, 0);  // Restore the previous state
        setDrawHistory([...drawHistory]);  // Update the history
      }
    }
  };

  const handleApply = () => {
    console.log('Canvas applied!');
  };

  const toggleAction = (action: 'draw' | 'text' | 'erase') => {
    setCurrentAction(action);
    if (action === 'text') setIsModalOpen(false); // Close modal when switching away from text
  };

  const closeModal = () => {
    setIsModalOpen(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && textPosition) {
      ctx.font = '24px Arial';
      ctx.fillStyle = '#00e676';  // Green text
      ctx.fillText(textValue, textPosition.x, textPosition.y);
      setTextPosition(null);  // Clear the text position after applying the text
      setTextValue('');  // Clear the input field
    }
  };

  const handleTextClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentAction === 'text') {
      setTextPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      setIsModalOpen(true);  // Open the modal to input text

      // Automatically focus on the input field when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      {/* Control Buttons */}
      <div className="absolute left-2 top-2 m-2 p-1 flex space-x-2">
        <Button onClick={handleSave} className="bg-transparent hover:bg-transparent">
          <Save className='h-4 w-4 text-green-500'/>
        </Button>
        <Button onClick={handleUndo} className="bg-transparent hover:bg-transparent">
          <Undo2 className='h-4 w-4 text-yellow-500'/>
        </Button>
        <Button onClick={handleApply} className="bg-transparent hover:bg-transparent">
          <CheckSquare className='h-4 w-4 text-blue-500'/>
        </Button>
        <Button onClick={() => toggleAction('draw')} className="bg-transparent hover:bg-transparent">
          <PenTool className='h-4 w-4 text-purple-500'/>
        </Button>
        <Button onClick={() => toggleAction('text')} className="bg-transparent hover:bg-transparent">
          <Type className='h-4 w-4 text-red-500'/>
        </Button>
        <Button onClick={() => toggleAction('erase')} className="bg-transparent hover:bg-transparent">
          <Eraser className='h-4 w-4 text-orange-500'/>
        </Button>
      </div>

      {/* Text Modal at Clicked Position */}
      {isModalOpen && textPosition && (
        <div
          className="absolute bg-[#1b1b1b] bg-opacity-75 px-2 py-1 border border-green-500 flex justify-between items-center rounded"
          style={{ left: textPosition.x, top: textPosition.y }}
        >
          <input
            ref={inputRef}  // Attach the ref for focusing
            type="text"
            className="text-green-500 text-xl w-full px-2 bg-transparent outline-none"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text..."
          />
          <Button
            onClick={closeModal}
            className="m-1 p-0 bg-transparent hover:bg-transparent"
          >
            <CheckSquare className="h-5 w-5 text-green-500" />
          </Button>
          <Button
            onClick={()=>setIsModalOpen(false)}
            className="m-1 p-0 bg-transparent hover:bg-transparent"
          >
            <X className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onClick={handleTextClick}
        className={`border border-[#2a2a2a] rounded h-full w-full ${currentAction === 'text' ? 'cursor-text' : (currentAction == 'draw' ? 'cursor-crosshair' : 'cursor-not-allowed')}`}  // Full width and height, cursor changes based on action
      />
    </div>
  );
};

export default CanvasArea;
