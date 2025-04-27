import React, { useState, useEffect } from "react";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const JsonApiTester = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
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

  const testApi = async () => {
    setError("");
    setResponse(null);

    // Check if URL is provided
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (method === "POST" || method === "PUT" || method === "PATCH") {
        if (!body.trim()) {
          setError("Please provide the JSON body for POST/PUT/PATCH requests.");
          return;
        }
        options.body = body;
      }

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      saveUsage();

    } catch (err) {
      setError(`Failed to fetch API. ${err.message}`);
    }
  };


  return (
    <div className="container-fluid container-ed  p-4">
<h3 className="text-center mb-4">JSON API Tester         <BookmarkButton /> 
</h3>
<p className="text-center"> The tool supports common HTTP methods such as GET, POST, PUT, DELETE, PATCH, etc., enabling users to fully test APIs.</p>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        theme={settings.theme}

      />
      <select
                theme={settings.theme}

        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="form-select mb-3"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>

      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <textarea
          className="form-control mb-3"
          placeholder="Enter JSON body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          theme={settings.theme}

        />
      )}

      <button onClick={testApi} className="btn btn-primary mb-3">
        Test API
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {response && (
        <div className="alert alert-success">
          <h4>API Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      <p className="text-center pt-4"> The JSON API Tester Tool is a powerful and easy-to-use platform designed for developers and testers to interact with RESTful APIs. This tool allows users to send HTTP requests to an API and receive JSON responses, helping them validate API behavior, troubleshoot issues, and ensure data integrity in a straightforward manner.</p>
      <p className="text-center pt-4">Time-Saving: Accelerates the testing and debugging process by allowing users to quickly send requests and see responses without writing complex code.</p>
      <p className="text-center">Flexible: The tool allows for deep customization, so you can test every edge case or potential scenario your API might encounter.</p>
<p className="text-center">Insightful: Provides valuable insights such as response time, status codes, and full API output, making it easier to understand the behavior of an API.</p>
    </div>
  );
};

export default JsonApiTester;
