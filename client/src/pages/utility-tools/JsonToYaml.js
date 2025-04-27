import React, { useState, useEffect } from "react";
import yaml from "js-yaml";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const JsonYamlConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState("jsonToYaml");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
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

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setErrorMessage("Please enter valid JSON or YAML to convert.");
        setShowToast(true);
        setOutput("");
        return;
      }

      if (format === "jsonToYaml") {
        const json = JSON.parse(input);
        const yamlOutput = yaml.dump(json);
        setOutput(yamlOutput);
      } else {
        const yamlInput = yaml.load(input);
        const jsonOutput = JSON.stringify(yamlInput, null, 2);
        setOutput(jsonOutput);
      }
      saveUsage();

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error: Invalid input.");
      setShowToast(true);
      setOutput("");
    }
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">JSON ↔ YAML Converter         <BookmarkButton /> 
      </h1>
      <p className="text-center">
        Convert JSON to YAML or YAML to JSON quickly and easily. Paste your input and select the conversion direction.
      </p>
      <div className="row my-5">
        <div className="col-md-5">
          <h3 className="text-center">Input</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="json"
            value={input}
            onChange={(value) => setInput(value || "")}
            options={editorOptions}
            theme={settings.theme}

          />
        </div>
        <div className="col-md-2 d-flex flex-column justify-content-center">
          <select
            className="form-select mb-3"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="jsonToYaml">JSON to YAML</option>
            <option value="yamlToJson">YAML to JSON</option>
          </select>
          <button className="btn btn-success w-100" onClick={handleConvert}>
            Convert
          </button>
        </div>
        <div className="col-md-5">
          <h3 className="text-center">Output</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="json"
            value={output}
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
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      </div>

      <p className="text-center">
        Use this tool to convert between JSON and YAML formats seamlessly. Simply paste your input, select the desired format, and click "Convert".
      </p>
    </div>
  );
};

export default JsonYamlConverter;
