import { error } from 'console';
import React, { useState } from 'react';
import { FaSyncAlt, FaHammer } from 'react-icons/fa';
type LogDisplayProps = {
  rawLog: string;
  reloader: ()=>void;
  fixer: (error: string,file: string)=>void;
};

type ParsedLog = {
  component: string;
  errorDetails: string;
  recommendation?: string;
  countErrors?: number;
};

const parseWebpackLog = (rawLog: string): ParsedLog[] => {
  if(!rawLog) {
    return []
  }
  const logEntries: ParsedLog[] = [];
  const logLines = rawLog.split('\n');

  let currentError: ParsedLog | null = null;
  let components = []
  for(let i=0; i< logLines.length; i++) {
    let line = logLines[i]
    const trimmedLine = line.trim();
    console.log(trimmedLine)
    // Detect new error section starting with './' (file path)
    if (trimmedLine.startsWith('./')) {
        currentError = {
          component: trimmedLine,
          errorDetails: '', // Start capturing error details
          recommendation: '',
          countErrors: 1
        };
        let j=i+1;
        while(!(logLines[j] + "").startsWith("./") && j < logLines.length) {
          if((logLines[j] + "").startsWith("info")) {
            currentError.recommendation += logLines[j] + "\n";
          } else {
            currentError.errorDetails += logLines[j] + "\n";
          }
          j++;
        }
        i = j;
      // Push the current error if any details have been captured
      if (currentError) {
        logEntries.push(currentError);
      }
    }    

      // Start a new error section with the component as the file path
    

    // If we are in an error section, capture all lines until the next './'
  };
  let keepEntries = {}
  logEntries.forEach(el=>{
    if (keepEntries[el.component]){
      keepEntries[el.component] = {
        ...keepEntries[el.component],
        errorDetails: keepEntries[el.component].errorDetails + "\n" + el.errorDetails,
        countErrors: keepEntries[el.component].countErrors + 1
      }
    } else {
      keepEntries[el.component] = el
    }

  })
  
  

  if(logEntries.length == 0) {
    currentError = {
      component: "BUILD [unhandled]",
      errorDetails: rawLog, // Start capturing error details
      recommendation: "build failed due to caching,please reload"
    };
    logEntries.push(currentError)
    return logEntries
  }
  return Object.values(keepEntries);
};

const ErrorLog: React.FC<LogDisplayProps> = ({ rawLog,reloader,fixer }) => {
  const logEntries = parseWebpackLog(rawLog);

  return (
    <div className="px-6 rounded-lg text-white space-y-4 mt-10">
      <div className="rounded-md mt-2 text-xs">
        {logEntries.map((entry, index) => (
          <LogEntry key={index} entry={entry} reloader={reloader} fixer={fixer} />
        ))}
      </div>
    </div>
  );
};

// Component for displaying each log entry
const LogEntry: React.FC<{ entry: ParsedLog,reloader: ()=>void,fixer: (error: string,file: string)=>void }> = ({ entry,reloader,fixer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#121212] p-2 rounded-lg shadow-lg my-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold pl-2 text-yellow-400">
          Component: {entry.component}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-sm text-green-400"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Full error details (collapsible) */}
      {isExpanded && (
        <pre className="whitespace-pre-wrap bg-zinc-900 p-3 rounded-md mt-2 text-sm">
          {entry.errorDetails}
        </pre>
      )}

      {/* Recommendation section for .next-related ENOENT */}
      {entry.recommendation && (
        <p className="mt-2 text-red-400 text-sm">
          {entry.recommendation}{' '}
        </p>
      )}
      {entry.errorDetails && <>
        <div className='my-2 flex justify-between'>
        <button onClick={()=>fixer(entry.errorDetails,entry.component)} className="text-orange-800 p-2 rounded-sm ml-2 text-lg">
            <FaHammer className="inline-block mr-2 w-5 h-5" />
            Fix {entry.countErrors ? entry.countErrors + " " + (entry.countErrors > 1 ? "errors" : "error" ) : ""} 
          </button>
          
        <button onClick={reloader} className="text-slate-400 ml-4">
            <FaSyncAlt className="inline-block mr-1 w-4 h-4" />
          </button>
          
        </div>
        </>}
    </div>
  );
};

export default ErrorLog;
