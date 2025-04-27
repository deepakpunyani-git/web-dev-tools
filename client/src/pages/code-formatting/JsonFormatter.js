import React, { useState, useEffect } from "react";
import BookmarkButton from "../../components/BookmarkButton"; 
import { useSaveToolUsage  } from '../../components/saveUsage';

const JsonFormatterValidator = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
     
      theme: "vs-light",

    };
  
    const settings = { ...defaultSettings, ...storedSettings };
  
  const handleFormatAndValidate = () => {
    try {
      if (!inputJson.trim()) {
        setErrorMessage("Please enter JSON to format and validate.");
        setFormattedJson("");
        return;
      }

      const parsedJson = JSON.parse(inputJson); 
      const prettyJson = JSON.stringify(parsedJson, null, 2); 
      setFormattedJson(prettyJson);
      setErrorMessage("");
      saveUsage();
 
    } catch (error) {
      setErrorMessage(`Invalid JSON: ${error.message}`);
      setFormattedJson("");
    }
  };

  const handleDownload = () => {
    if (!formattedJson.trim()) {
      setErrorMessage("No valid JSON to download!");
      return;
    }

    const blob = new Blob([formattedJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "formatted.json";
    link.click();
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h3 className="text-center mb-4">JSON Formatter & Validator         <BookmarkButton /> 
      </h3>
      
      <div className="mb-3">
        <label htmlFor="jsonInput" className="form-label">
          Enter JSON:
        </label>
        <textarea
          id="jsonInput"
          className="form-control"
          rows="10"
          placeholder="Paste your JSON here..."
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          theme={settings.theme}

        />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-success"
          onClick={handleFormatAndValidate}
        >
          Format JSON
        </button>
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={!formattedJson.trim()}
        >
          Download JSON
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="formattedJson" className="form-label">
          Formatted JSON:
        </label>
        <textarea
          id="formattedJson"
          className="form-control"
          rows="10"
          readOnly
          value={formattedJson}
          placeholder="Formatted JSON will appear here..."
          theme={settings.theme}

        />
      </div>
      <p className="text-center pt-4">
  A tool designed to format and validate your JSON data with precision. This ensures your JSON is properly structured and free of syntax errors, making it easier to debug and integrate into your applications.
</p>
    </div>
  );
};

export default JsonFormatterValidator;
