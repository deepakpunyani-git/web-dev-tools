import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import * as esprima from "esprima";
import { js as jsBeautify } from "js-beautify";
import BookmarkButton from "../../components/BookmarkButton"; 
import { useSaveToolUsage  } from '../../components/saveUsage';
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

const JsValidator = () => {
  const [settings, setSettings] = useState(() => {
      try {
        const saved = localStorage.getItem("toolSettingsDefaults");
        return saved ? JSON.parse(saved) : defaultSettings;
      } catch {
        return defaultSettings;
      }
    });
  

  const [inputJs, setInputJs] = useState("");
  const [validatedJs, setValidatedJs] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
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

  const handleValidate = () => {
    if (!inputJs.trim()) {
      setToastMessage("Please enter JavaScript code to validate!");
      setShowToast(true);
      return;
    }

    try {
      esprima.parseScript(inputJs, { tolerant: true });
      
      const beautifiedJs = jsBeautify(inputJs, {
        indent_size: settings.tabSize,
        space_in_empty_paren: true, 
      });


      setValidatedJs(beautifiedJs); 
      setIsValid(true);
      setToastMessage("JavaScript code beautified successfully");
      saveUsage();

    } catch (error) {
      setIsValid(false);
      setToastMessage(`Error: ${error.message}`);
    }

    setShowToast(true);
  };

  const handleDownload = () => {
    if (!validatedJs.trim() || !isValid) {
      setToastMessage("No valid JavaScript to download!");
      setShowToast(true);
      return;
    }

    const blob = new Blob([validatedJs], { type: "application/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Beautify.js";
    link.click();
  };


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

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">JavaScript Beautifier         <BookmarkButton /> 
      </h1>
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
            theme={settings.theme}

            onChange={(value) => setInputJs(value || "")}
            options={editorOptions}

          />
        </div>

        <div className="col-md-2 d-flex flex-column justify-content-center">
          <button
            className="btn btn-success w-100 mb-3"
            onClick={handleValidate}
          >
            Beautify
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
            theme={settings.theme}

            value={validatedJs}
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

      <p className="text-center">This tool that takes poorly formatted JavaScript code and automatically reformats it to make it more readable by adding proper indentation, line breaks, and spacing , essentially cleaning up the code structure to improve maintainability and understanding. </p>
    </div>
  );
};

export default JsValidator;
