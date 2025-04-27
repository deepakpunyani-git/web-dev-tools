import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import * as esprima from "esprima";
import { minify } from "terser";
import BookmarkButton from "../../components/BookmarkButton"; 
import { useSaveToolUsage  } from '../../components/saveUsage';

const JsMinifier = () => {
  const [inputJs, setInputJs] = useState("");
  const [minifiedJs, setMinifiedJs] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const saveUsage = useSaveToolUsage();

  const [storedSettings, setStoredSettings] = useState(null);
  
  
    useEffect(() => {
        try {
          const settingsStr = window.localStorage.getItem("toolSettingsDefaults");
          if (settingsStr) {
            setStoredSettings(JSON.parse(settingsStr));
          } else {
            setStoredSettings(null);
          }
        } catch {
          setStoredSettings(null);
        }
      }, []);
    
      const defaultSettings = {
        tabSize: 2,
        wordWrap: "off",
        minimap: true,
        fontSize: 14,
        insertSpaces: true,
        theme: "vs-light",
        lineNumbers: "on",
        cursorStyle: "line",
        renderIndentGuides: true,
      };
    
      const settings = { ...defaultSettings, ...storedSettings };
      const editorOptions = {
        tabSize: settings.tabSize,
        wordWrap: settings.wordWrap,
        minimap: { enabled: settings.minimap },
        fontSize: settings.fontSize,
        insertSpaces: settings.insertSpaces,
        lineNumbers: settings.lineNumbers,
        cursorStyle: settings.cursorStyle,
        renderIndentGuides: settings.renderIndentGuides,
        formatOnPaste: true,
        formatOnType: true,
      };

  const handleMinify = async () => {
    if (!inputJs.trim()) {
      setToastMessage("Please enter JavaScript code to validate!");
      setShowToast(true);
      return;
    }

    try {
      esprima.parseScript(inputJs, { tolerant: true });
      setMinifiedJs(inputJs); 
      setIsValid(true);
      const result = await minify(inputJs); 
      setMinifiedJs(result.code);
      setToastMessage("JavaScript code minified");
      saveUsage();

    } catch (error) {
      setIsValid(false);
      setToastMessage(`Error: ${error.message}`);
    }

    setShowToast(true);


  };

  const handleDownload = () => {

    if (!isValid) {
      setToastMessage("No valid JavaScript to download!");
      setShowToast(true);
      return;
    }

    const blob = new Blob([minifiedJs], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "minified.js";
    link.click();
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">JavaScript Minifier  <BookmarkButton /> </h1>
      <p className="text-center">
        Paste your JavaScript code below to validate it for syntax errors. If
        valid, you can download the code.
      </p>


      <div className="row my-5">
        <div className="col-md-5">
          <h3 className="text-center">Input</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="javascript"
            value={inputJs}
            onChange={(value) => setInputJs(value || "")}
            options={editorOptions}
            theme={settings.theme}
          />
        </div>

        <div className="col-md-2 d-flex flex-column justify-content-center">
          <button
            className="btn btn-success w-100 mb-3"
            onClick={handleMinify}
          >
            Minify JS
          </button>
          <button className="btn btn-primary w-100" onClick={handleDownload}>
            Download
          </button>
        </div>

        <div className="col-md-5">
          <h3 className="text-center">Output</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="javascript"
            value={minifiedJs}
            theme={settings.theme}
            options={{ readOnly: true, ...editorOptions }}
          />
        </div>
      <ToastContainer className="p-3 end-0">
        <Toast
            bg="warning"
            onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      </div>
      <p className="text-center">This tool that takes your JavaScript code and removes unnecessary characters like whitespace, comments, and sometimes even long variable names, resulting in a smaller file size while maintaining the same functionality</p>
    </div>
  );
};

export default JsMinifier;
