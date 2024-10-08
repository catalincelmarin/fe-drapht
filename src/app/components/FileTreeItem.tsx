"use client";

import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, File, Cog, Puzzle, FileText, PlusCircle, Trash2 } from 'lucide-react';
import { setOpenFolders, setUploadModal } from '../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

type FileTreeItemProps = {
  item: { type: string; name: string; children?: any[]; scope?: string; path: string }; // Ensure you have the right structure for the item
  level?: number;
  onSelectFile: (file: any) => void;
  selectedFile: any;
  onDeleteItem: (path: string, type: string) => void; // Deletion handler
  onMoveFile: (sourcePath: any, destinationPath: any) => void; // Move file handler
};

const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, level = 0, onSelectFile, selectedFile, onDeleteItem, onMoveFile }) => {
  const { openFolders } = useSelector((state: RootState) => state.app);
  const [isOpen, setIsOpen] = useState(openFolders.filter(el => el.includes(item.path)).length > 0);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(item.name);
  const dispatch = useDispatch();

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      if (!isOpen) {
        dispatch(setOpenFolders([...openFolders.filter(el => el !== item.path), item.path]));
      } else {
        dispatch(setOpenFolders(openFolders.filter(el => el !== item.path)));
      }
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = () => {
    onSelectFile(item);
  };

  const handleOpenModal = (path: string) => {
    dispatch(setUploadModal(path));
  };

  const handleDelete = () => {
    onDeleteItem(item.path, item.type); // Pass the path and type to delete
  };

  // Handle drag start (for dragging files)
  const handleDragStart = (e: React.DragEvent, path: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', path);
  };

  // Handle drag over (to allow dropping on folders)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow a drop
  };

  // Handle drop event (to move the dragged file to the folder)
  const handleDrop = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    e.stopPropagation
    if (selectedFile && selectedFile.path !== folderPath) {
      
      const newFile = {
        ...selectedFile,
        path: folderPath
      }
      onMoveFile(selectedFile, newFile); // Move the file
    }
    
    
  };

  const handleDoubleClick = () => {
    if (item.type === 'file') {
      setIsRenaming(true);
    }
  };

  const handleRenameSubmit = () => {
    if (newFileName.trim() !== '') {
      const dst = {
        ...item,
        name: newFileName 
      }
      onMoveFile(item, dst);
      setIsRenaming(false);
    }
  };

  const handleRenameBlur = () => {
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const isSelected = selectedFile && selectedFile.path === item.path && selectedFile.name === item.name;

  return (
    <div
      className="relative"
      onDragOver={item.type === 'folder' ? handleDragOver : undefined}
      onDrop={item.type === 'folder' ? (e) => handleDrop(e, item.path) : undefined}
    >
      {/* Trashcan icon appears on the left side of the selected file or folder */}
      {isSelected && (selectedFile.children?.length === 0 || selectedFile.children === undefined) && (
        <Trash2
          className="absolute left-2 top-5 transform -translate-y-1/2 h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
          onClick={handleDelete}
        />
      )}

      <div
        className={`flex items-center py-2 px-4 cursor-pointer transition-colors ${
          isSelected ? 'bg-[#2a2a2a] text-[#00e676]' : 'hover:bg-[#2a2a2a] text-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
        onClick={handleItemClick}
        onDoubleClick={handleDoubleClick} // Double-click to trigger renaming
        draggable={item.type === 'file'}
        onDragStart={item.type === 'file' ? (e) => handleDragStart(e, item.path) : undefined}
      >
        {item.type === 'folder' && (
          <span onClick={toggleOpen} className="mr-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 mr-2 text-[#00e676]" />
        ) : item.scope === 'schema' ? (
          <Cog className="h-4 w-4 mr-2 text-gray-400" />
        ) : item.scope === 'component' ? (
          <Puzzle className="h-4 w-4 mr-2 text-gray-400" />
        ) : item.name === 'page.js' ? (
          <FileText className="h-4 w-4 mr-2 text-gray-400" />
        ) : (
          <File className="h-4 w-4 mr-2 text-gray-400" />
        )}

        {/* Render input field if renaming, else show file name */}
        {isRenaming ? (
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRenameBlur}
            className="bg-transparent border-b border-none outline-none w-24 text-green-500 px-2"
            autoFocus
          />
        ) : (
          <span>{item.name}</span>
        )}

        {item.type === 'folder' && isSelected && (
          <PlusCircle onClick={() => handleOpenModal(item.path)} className="ml-auto h-4 w-4 text-gray-400 hover:text-[#00e676]" />
        )}
      </div>

      {item.type === 'folder' && isOpen && (
        <div>
          {item.children &&
            item.children.map((child, index) => (
              <FileTreeItem
                key={index}
                item={child}
                level={level + 1}
                onSelectFile={onSelectFile}
                selectedFile={selectedFile}
                onDeleteItem={onDeleteItem} // Pass delete handler down to children
                onMoveFile={onMoveFile} // Pass move handler down to children
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeItem;
