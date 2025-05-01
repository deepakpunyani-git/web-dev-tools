import React, { useState, useEffect } from "react";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const defaultSettings = {
     
  theme: "vs-light",

};

const SEOChecker = () => {

  const [settings, setSettings] = useState(() => {
        try {
          const saved = localStorage.getItem("toolSettingsDefaults");
          return saved ? JSON.parse(saved) : defaultSettings;
        } catch {
          return defaultSettings;
        }
      });
  

  const [url, setUrl] = useState("");
  const [metaTags, setMetaTags] = useState([]);
  const [headings, setHeadings] = useState([]);
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

  const checkSEO = async () => {
    if (!url.trim()) {
      setErrorMessage("Please enter a valid URL.");
      setMetaTags([]);
      setHeadings([]);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch the webpage.");
      }

      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const metaTagsArray = Array.from(doc.getElementsByTagName("meta")).map((meta) => ({
        name: meta.getAttribute("name") || meta.getAttribute("property"),
        content: meta.getAttribute("content"),
      }));

      // Extract headings (H1-H6)
      const headingsArray = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading) => ({
        tag: heading.tagName,
        text: heading.textContent.trim(),
      }));

      setMetaTags(metaTagsArray);
      setHeadings(headingsArray);
      setErrorMessage("");
      saveUsage();

    } catch (error) {
      setErrorMessage("Failed to fetch or parse the webpage. Please check the URL.");
      setMetaTags([]);
      setHeadings([]);
    }
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h3 className="text-center mb-4">SEO Checker         <BookmarkButton /> 
      </h3>
      <p className="text-center">Extract meta tags and headings from a webpage using a given URL</p>
      <p className="text-center text-danger">Parsing large pages can take time. Consider optimizing or limiting the scope of elements to parse. Client-side requests to other domains may fail due to CORS restrictions. Use a proxy server to bypass this. Ensure the page provides valid HTML. Malformed pages may cause parsing issues.
      </p>
      <div className="mb-3">
      <label className="form-label"> Enter Url : </label>

        <input
          type="text"
          className="form-control"
          placeholder="Enter URL to check"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          theme={settings.theme}

        />
      </div>
      <button className="btn btn-primary" onClick={checkSEO}>
        Check SEO
      </button>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {metaTags.length > 0 && (
        <div className="mt-4  alert alert-success">
          <h4>Meta Tags</h4>
          <ul>
  {metaTags
    .filter((meta) => meta.name && meta.content)
    .map((meta, index) => (
      <li key={index}>
        <strong>{meta.name}:</strong> {meta.content}
      </li>
    ))}
</ul>
        </div>
      )}

      {headings.length > 0 && (
        <div className="mt-4  alert alert-success">
          <h4>Headings</h4>
          <ul>
            {headings.map((heading, index) => (
              <li key={index}>
                <strong>{heading.tag}:</strong> {heading.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p  className="text-center pt-5">Retrieve the HTML content of the target webpage. On the client-side, you can use the fetch API. On the server-side, libraries like axios or node-fetch are commonly used. Ensure proper handling of CORS (Cross-Origin Resource Sharing) for client-side applications.</p>
      <p  className="text-center">Meta tags provide metadata about the webpage. You can extract tags like:

description
keywords
Open Graph tags (e.g., og:title, og:description)
Twitter tags (e.g., twitter:title)</p>
<p  className="text-center">Headings (H1-H6) define the structure of the content on the webpage. They are important for:

SEO (Search Engine Optimization)
Accessibility</p>
<p className="text-center pt-2">This tool is designed to enhance the user experience by providing structured, hierarchical content that emphasizes key information. </p>
    </div>
  );
};

export default SEOChecker;
