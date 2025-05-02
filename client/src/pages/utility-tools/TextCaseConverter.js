import React, { useState, useEffect } from "react";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const defaultSettings = {
     
  theme: "vs-light",

};

const TextCaseConverter = () => {

   const [settings, setSettings] = useState(() => {
        try {
          const saved = localStorage.getItem("toolSettingsDefaults");
          return saved ? JSON.parse(saved) : defaultSettings;
        } catch {
          return defaultSettings;
        }
      });
  

  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const saveUsage = useSaveToolUsage();


  
   useEffect(() => {
       const onStorageChange = (e) => {
         if (e.key === "toolSettingsDefaults") {
           try {
             setSettings(JSON.parse(e.newValue));
           } catch {}
         }
       };
       window.addEventListener("storage", onStorageChange);
       return () => window.removeEventListener("storage", onStorageChange);
     }, []);
   
     useEffect(() => {
       const interval = setInterval(() => {
         try {
           const latest = localStorage.getItem("toolSettingsDefaults");
           if (latest) {
             const parsed = JSON.parse(latest);
             const current = JSON.stringify(settings);
             if (JSON.stringify(parsed) !== current) {
               setSettings(parsed);
             }
           }
         } catch {}
       }, 1000);
       return () => clearInterval(interval);
     }, [settings]);

  const validateInput = () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter some text to convert.");
      setConvertedText(""); 
      return false;
    }
    setErrorMessage(""); 
    return true;
  };

  const toUpperCase = () => {
    if (validateInput()) {
      setConvertedText(inputText.toUpperCase());
    }
    saveUsage();

  };

  const toLowerCase = () => {
    if (validateInput()) {
      setConvertedText(inputText.toLowerCase());
    }
    saveUsage();

  };

  const toTitleCase = () => {
    if (validateInput()) {
      const titleCased = inputText
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setConvertedText(titleCased);
      
    }
    saveUsage();

  };

  const toSentenceCase = () => {
    if (validateInput()) {
      const sentenceCased = inputText
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
      setConvertedText(sentenceCased);
    }
    saveUsage();

  };

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">Text Case Converter         <BookmarkButton /> 
      </h1>
      <textarea
        className="form-control mb-3"
        rows="6"
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        theme={settings.theme}

      />
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
        <button className="btn btn-primary" onClick={toUpperCase}>
          UPPERCASE
        </button>
        <button className="btn btn-primary" onClick={toLowerCase}>
          lowercase
        </button>
        <button className="btn btn-primary" onClick={toTitleCase}>
          Title Case
        </button>
        <button className="btn btn-primary" onClick={toSentenceCase}>
          Sentence case
        </button>
      </div>
      <textarea
        className="form-control"
        rows="6"
        placeholder="Converted text will appear here..."
        value={convertedText}
        theme={settings.theme}

        readOnly
      />
      <p className="text-center pt-4">
        This tool allows you to transform your text between different cases such as UPPERCASE, lowercase, Title Case, and Sentence case effortlessly. Ideal for content formatting and text standardization.
      </p>
    </div>
  );
};

export default TextCaseConverter;
