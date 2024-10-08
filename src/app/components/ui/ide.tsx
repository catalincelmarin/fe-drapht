"use client"; // This makes the component a client component

import React, { useState } from 'react';
import { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view'; // Import line wrapping extension
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { useDispatch } from 'react-redux';
import { setGeneratedCode } from '@/app/redux/appSlice';

interface CodeEditorProps {
  language: 'js' | 'typescript' | 'html' | 'css' | 'json' | 'yaml';
  value: string;
  onChange: (value: string) => void;
}

function Ide({myCode,lang}: {myCode: string,lang?: string}) {
  const dispatch = useDispatch()
  const [extensions, setExtensions] = useState<any[]>([]);

  useEffect(() => {
    console.log(lang)
    switch (lang) {
      case 'js':
        setExtensions([javascript()]);
        break;

      case 'html':
        setExtensions([html()]);
        break;
      case 'css':
        setExtensions([css()]);
        break;
      case 'yaml':
        setExtensions([yaml()]);
        break;
      case 'json':
        setExtensions([json()]);
        break;
      default:
        setExtensions([javascript()]);
    }
  }, [lang]);

  return (
    <CodeMirror
      value={myCode}
      
      theme={oneDark}
      extensions={[...extensions, EditorView.lineWrapping]} // Add line wrapping here

      
      onChange={(evn) => dispatch(setGeneratedCode(evn))}
      className="w-full h-full"
    />
  );
};

export default Ide;
