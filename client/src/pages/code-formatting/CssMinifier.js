import React, { useState, useEffect } from "react";
import { minify } from "csso";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
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

const CssMinifier = () => {

    const [settings, setSettings] = useState(() => {
      try {
        const saved = localStorage.getItem("toolSettingsDefaults");
        return saved ? JSON.parse(saved) : defaultSettings;
      } catch {
        return defaultSettings;
      }
    });
  


  const [inputCss, setInputCss] = useState("");
  const [minifiedCss, setMinifiedCss] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInput, setLastInput] = useState("");
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

    if (inputCss === lastInput) {
      setToastMessage("Input CSS hasn't changed.");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const validation = await validateCss(inputCss);
      if (!validation.isValid) {
        setToastMessage(validation.message);
        return;
      }

      const result = minify(inputCss);
      setMinifiedCss(result.css);
      setLastInput(inputCss);
      setToastMessage("CSS successfully minified!");
      saveUsage();
    } catch (error) {
      setToastMessage(`Error minifying CSS: ${error.message}`);
    } finally {
      setLoading(false);
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

  const handleCopyToClipboard = () => {
    if (!minifiedCss.trim()) {
      setToastMessage("Nothing to copy!");
      setShowToast(true);
      return;
    }

    navigator.clipboard.writeText(minifiedCss);
    setToastMessage("Minified CSS copied to clipboard!");
    setShowToast(true);
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
        CSS Minifier <BookmarkButton />
      </h1>
      <p className="text-center">
        Paste your CSS code below to validate it for syntax errors. If valid, you can download or copy the code.
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
          <button className="btn btn-success w-100 mb-3" onClick={handleMinify} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" /> Minifying...
              </>
            ) : (
              "Minify CSS"
            )}
          </button>
          <button className="btn btn-primary w-100 mb-3" onClick={handleDownload}>
            Download Minified CSS
          </button>
          <button className="btn btn-secondary w-100" onClick={handleCopyToClipboard}>
            Copy to Clipboard
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
      </div>

      <ToastContainer className="p-3 end-0 position-fixed" style={{ top: "1rem", right: "1rem", zIndex: 9999 }}>
        <Toast bg="warning" onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide>
          <Toast.Body style={{ whiteSpace: "pre-wrap" }}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <p className="text-center mt-4">
        CSS minifier is a tool designed to improve the readability and organization of your CSS code. It formats
        the code with consistent indentation and line breaks, making it easier to maintain, essentially cleaning up the
        code structure to improve maintainability and understanding.
      </p>
    </div>
  );
};

export default CssMinifier;
