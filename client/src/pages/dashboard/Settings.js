import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_EDITOR_SETTINGS } from "../../graphql/mutations";
import { GET_EDITOR_SETTINGS } from "../../graphql/queries";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import DashboardLayout from "../../DashboardLayout";

export default function EditorSettingsPage() {
  const { data, loading, error, refetch } = useQuery(GET_EDITOR_SETTINGS);
  const [updateSettingsMutation, { loading: updating }] = useMutation(UPDATE_EDITOR_SETTINGS);
  const [settings, setSettings] = useState({
    minimap: true,
    wordWrap: "on",
    tabSize: 2,
    fontSize: 14,
    theme: "vs-light",
    insertSpaces: true,
    lineNumbers: "on",
    cursorStyle: "line",
    renderIndentGuides: true,
  });

  useEffect(() => {
    if (data?.getEditorSettings) {
      setSettings(data.getEditorSettings);
    }
  }, [data]);

  const updateSettings = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const {
      minimap,
      wordWrap,
      tabSize,
      fontSize,
      theme,
      insertSpaces,
      lineNumbers,
      cursorStyle,
      renderIndentGuides,
    } = settings;

    const cleanedSettings = {
      minimap,
      wordWrap,
      tabSize,
      fontSize,
      theme,
      insertSpaces,
      lineNumbers,
      cursorStyle,
      renderIndentGuides,
    };

    await updateSettingsMutation({
      variables: { toolSettingsDefaults: cleanedSettings },
    });
    localStorage.setItem("toolSettingsDefaults", JSON.stringify(cleanedSettings));

    refetch();
  };

  return (
    <DashboardLayout>
      <h2>Editor Settings</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p>Error loading settings</p>
      ) : (
        <Card className="p-4">
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Show Minimap"
              checked={settings.minimap}
              onChange={(e) => updateSettings("minimap", e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Word Wrap</Form.Label>
            <Form.Select
              value={settings.wordWrap}
              onChange={(e) => updateSettings("wordWrap", e.target.value)}
            >
              <option value="off">Off</option>
              <option value="on">On</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tab Size</Form.Label>
            <Form.Select
              value={settings.tabSize}
              onChange={(e) => updateSettings("tabSize", parseInt(e.target.value, 10))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Font Size</Form.Label>
            <Form.Select
              value={settings.fontSize}
              onChange={(e) => updateSettings("fontSize", parseInt(e.target.value, 10))}
            >
              <option value={12}>12</option>
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Theme</Form.Label>
            <Form.Select
              value={settings.theme}
              onChange={(e) => updateSettings("theme", e.target.value)}
            >
              <option value="vs-light">Light</option>
              <option value="vs-dark">Dark</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Insert Spaces"
              checked={settings.insertSpaces}
              onChange={(e) => updateSettings("insertSpaces", e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Line Numbers</Form.Label>
            <Form.Select
              value={settings.lineNumbers}
              onChange={(e) => updateSettings("lineNumbers", e.target.value)}
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cursor Style</Form.Label>
            <Form.Select
              value={settings.cursorStyle}
              onChange={(e) => updateSettings("cursorStyle", e.target.value)}
            >
              <option value="line">Line</option>
              <option value="block">Block</option>
              <option value="underline">Underline</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Render Indent Guides"
              checked={settings.renderIndentGuides}
              onChange={(e) => updateSettings("renderIndentGuides", e.target.checked)}
            />
          </Form.Group>

          <Button onClick={handleSave} disabled={updating}>
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}
