import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { HTMLHint } from "htmlhint";
import BookmarkButton from "../../components/BookmarkButton";
import { useSaveToolUsage  } from '../../components/saveUsage';

const HtmlBeautifier = () => {
  const [storedSettings, setStoredSettings] = useState(null);
  const [inputHtml, setInputHtml] = useState("");
  const [beautifiedHtml, setBeautifiedHtml] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const saveUsage = useSaveToolUsage();

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

  const validateHtml = (html) => {
    const rules = {
      "tag-pair": true,
      "attr-value-not-empty": false,
      "doctype-first": false,
      "id-unique": false,
      "src-not-empty": false,
    };
    const messages = HTMLHint.verify(html, rules);
    if (messages.length > 0) {
      const errorMessages = messages
        .map((msg) => `${msg.message} (Line: ${msg.line}, Col: ${msg.col})`)
        .join("\n");
      return { isValid: false, message: `Errors:\n${errorMessages}` };
    }
    return { isValid: true, message: "HTML is valid!" };
  };

  const handleBeautify = () => {
    if (!inputHtml.trim()) {
      setToastMessage("Please enter HTML code to beautify!");
      setShowToast(true);
      return;
    }
    const validation = validateHtml(inputHtml);
    if (!validation.isValid) {
      setToastMessage(`Invalid HTML:\n${validation.message}`);
      setShowToast(true);
      return;
    }
    try {
      const beautify = require("js-beautify").html;
      const formattedHtml = beautify(inputHtml, {
        indent_size: settings.tabSize,
        wrap_line_length: 120,
      });
      setBeautifiedHtml(formattedHtml);
      setToastMessage("HTML code beautified successfully!");
      setShowToast(true);
      saveUsage();

    } catch {
      setToastMessage("Error beautifying HTML code!");
      setShowToast(true);
    }
  };

  const handleDownload = () => {
    if (!beautifiedHtml.trim()) {
      setToastMessage("No beautified HTML to download!");
      setShowToast(true);
      return;
    }
    const blob = new Blob([beautifiedHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "beautified.html";
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
        HTML Beautifier <BookmarkButton />
      </h1>
      <p className="text-center">
        Paste your raw HTML code below, validate it, beautify it, and download the formatted version.
      </p>

      <div className="row my-5">
        <div className="col-md-5">
          <h3 className="text-center">Input</h3>
          <Editor
            className="editor-container"
            height="400px"
            defaultLanguage="html"
            theme={settings.theme}
            value={inputHtml}
            onChange={(value) => setInputHtml(value || "")}
            options={editorOptions}
          />
        </div>
        <div className="col-md-2 d-flex flex-column justify-content-center">
          <button className="btn btn-success w-100 my-3" onClick={handleBeautify}>
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
            defaultLanguage="html"
            theme={settings.theme}
            value={beautifiedHtml}
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
            <Toast.Body style={{ whiteSpace: "pre-wrap" }}>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>

      <p className="text-center">
        HTML Beautifier is an innovative online tool designed to simplify and enhance your HTML code. It automatically analyzes your markup and restructures it, resulting in a clean and well-formatted codebase. Whether you're a web developer, designer, or website owner, HTML Beautifier offers an efficient way to optimize your HTML and achieve a more professional and polished look.
      </p>
    </div>
  );
};

export default HtmlBeautifier;
