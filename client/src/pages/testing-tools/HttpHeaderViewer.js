import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const defaultSettings = {
     
  theme: "vs-light",

};


const HTTPHeaderViewer = () => {
   const [settings, setSettings] = useState(() => {
        try {
          const saved = localStorage.getItem("toolSettingsDefaults");
          return saved ? JSON.parse(saved) : defaultSettings;
        } catch {
          return defaultSettings;
        }
      });

  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState(null);
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

     
  const fetchHeaders = async () => {
    if (!url.trim()) {
      setErrorMessage("Please enter a valid URL.");
      setHeaders(null);
      return;
    }

    try {
      const response = await axios.head(url); 
      setHeaders(response.headers);
      setErrorMessage("");

    } catch (error) {
      setErrorMessage("Failed to fetch headers. Please check the URL or try again later.",error);
      setHeaders(null);
    }
    saveUsage();

  };

  return (
    <div className="container-fluid container-ed p-4">
      <h3 className="text-center mb-4">HTTP Header Viewer         <BookmarkButton /> 
      </h3>
      <div className="mb-3">
      <p className="text-center">
       It allows the HTTP response headers of any URL to be analyzed. 
      </p>
      <label className="form-label"> Enter Url : </label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter URL to fetch headers"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          theme={settings.theme}

        />
      </div>
      <button className="btn btn-primary" onClick={fetchHeaders}>
        View Headers
      </button>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {headers && (
        <div className="mt-4 alert alert-success">
          <h4>HTTP Headers</h4>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(headers, null, 2)}
          </pre>
        </div>
      )}
      <p className="text-center pt-4">Quickly and easily assess the security of your HTTP response headers.</p>
      <p className="text-center pt-4"> HTTP header is a part of response sent by a server with a requested page.
      The HTTP Header Checker tool is an online curl test. It allows the HTTP response headers of any URL to be analyzed. Optionally send custom Referer and X-Pull request headers as well as content encoding options, like Brotli and Gzip. The results returned will give the complete curl output.

The HTTP Header Checker tool can be used to verify server configurations, like checking whether or not hotlink protection and file compression has been set up correctly.

Display the HTTP headers of any web site. Use the simple web interface or access the Free API to check the http headers.
      </p>
    </div>
  );
};

export default HTTPHeaderViewer;
