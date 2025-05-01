import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { css } from "js-beautify";
import cssValidator from "w3c-css-validator";
import BookmarkButton from "../../components/BookmarkButton";
import { useSaveToolUsage } from "../../components/saveUsage";

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

const CssBeautifier = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("toolSettingsDefaults");
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [inputCss, setInputCss] = useState("");
  const [beautifiedCss, setBeautifiedCss] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const saveUsage = useSaveToolUsage();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "toolSettingsDefaults") {
        try {
          const updated = JSON.parse(e.newValue);
          setSettings({ ...defaultSettings, ...updated });
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const latest = JSON.parse(localStorage.getItem("toolSettingsDefaults"));
        if (JSON.stringify(settings) !== JSON.stringify({ ...defaultSettings, ...latest })) {
          setSettings({ ...defaultSettings, ...latest });
        }
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, [settings]);


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

  const handleBeautify = async () => {
    if (!inputCss.trim()) {
      setToastMessage("Please enter CSS code to beautify!");
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
      const formattedCss = css(inputCss, { indent_size: settings.tabSize });
      setBeautifiedCss(formattedCss);
      setToastMessage("CSS code beautified successfully!");
      setShowToast(true);
      saveUsage();
    } catch (error) {
      setToastMessage(`Error beautifying CSS code: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleDownload = () => {
    if (!beautifiedCss.trim()) {
      setToastMessage("No beautified CSS to download!");
      setShowToast(true);
      return;
    }
    const blob = new Blob([beautifiedCss], { type: "text/css" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "beautified.css";
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
      <h1 className="text-center mb-4">
        CSS Beautifier <BookmarkButton />
      </h1>
      <p className="text-center">
        Paste your raw CSS code below, validate it, beautify it, and download the formatted version.
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
          <button className="btn btn-success w-100 mb-3" onClick={handleBeautify}>
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
            defaultLanguage="css"
            value={beautifiedCss}
            theme={settings.theme}
            options={{ readOnly: true, ...editorOptions }}
          />
        </div>
        <ToastContainer className="p-3 end-0">
          <Toast bg="warning" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
      <p className="text-center">
        CSS Beautifier is a tool designed to improve the readability and organization of your CSS code. It
        formats the code with consistent indentation and line breaks, making it easier to maintain , essentially cleaning up the code structure to improve maintainability and understanding.
      </p>
    </div>
  );
};

export default CssBeautifier;
