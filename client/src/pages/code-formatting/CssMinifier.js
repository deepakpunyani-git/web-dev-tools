import React, { useState, useEffect } from "react";
import { minify } from "csso";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import cssValidator from 'w3c-css-validator';
import BookmarkButton from "../../components/BookmarkButton"; 
import { useSaveToolUsage  } from '../../components/saveUsage';

const CssMinifier = () => {
  const [inputCss, setInputCss] = useState("");
  const [minifiedCss, setMinifiedCss] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
  

  const validateCss = async (cssCode) => {
    try {
      const result = await cssValidator.validateText(cssCode, {
       medium: "all",
       warningLevel: 3,
       timeout: 3000,

      });

      

      if (result.valid) {
        return { isValid: true, message: "CSS is valid!" };
      } else {
        const errors = result.errors
          .map((err) => `${err.message} (line: ${err.line})`)
          .join("\n");

        return { isValid: false, message: `Validation Errors:\n${errors}` };
      }
    } catch (error) {
      return { isValid: false, message: `Validation error: ${error.message}` };
    }
  };


  const handleMinify = async () => {
    if (!inputCss.trim()) {
      setToastMessage("Please enter CSS code to minify!");
      setShowToast(true);
      return;
    }

    
    const validation = await validateCss(inputCss);
    if (!validation.isValid) {
      setToastMessage(validation.message);
      setShowToast(true);
      return;
    }

    try {
      const result = minify(inputCss);
      setMinifiedCss(result.css);
      setToastMessage("CSS successfully minified!");
      saveUsage();

    } catch (error) {
      setToastMessage(`Error minifying CSS: ${error.message}`);
    } finally {
      setShowToast(true);
    }
  };

  const handleDownload = () => {
    if (!minifiedCss.trim()) {
      setToastMessage("No minified CSS to download!");
      setShowToast(true);
      return;
    }

    const blob = new Blob([minifiedCss], { type: "text/css" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "minified.css";
    link.click();
    setToastMessage("Minified CSS downloaded!");
    setShowToast(true);
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">CSS Minifier         <BookmarkButton /> 
      </h1>
      <p className="text-center">
        Paste your CSS code below to validate it for syntax errors. If valid, you can download the code.
      </p>
      <div className="row my-5">
        <div className="col-md-5">
          <h3 className="text-center">Input</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="css"
            value={inputCss}
            onChange={(value) => setInputCss(value || "")}
            options={editorOptions}
            theme={settings.theme}
          />
        </div>

        <div className="col-md-2 d-flex flex-column justify-content-center">
          <button className="btn btn-success w-100 mb-3" onClick={handleMinify}>
            Minify CSS
          </button>
          <button className="btn btn-primary w-100" onClick={handleDownload}>
            Download Minified CSS
          </button>
        </div>

        <div className="col-md-5">
          <h3 className="text-center">Output</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="css"
            value={minifiedCss}
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

      <p className="text-center">
        CSS minifier is a tool designed to improve the readability and organization of your CSS code. It formats
        the code with consistent indentation and line breaks, making it easier to maintain, essentially cleaning up the
        code structure to improve maintainability and understanding.
      </p>
    </div>
  );
};

export default CssMinifier;
