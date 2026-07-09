import React, { useState, useEffect } from "react";
import "./App.css";
import { TENEECODE_MAPPING } from "./constant";
import { convertToTeencode, convertFromTeencode } from "./converter";

function App() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<"text-to-teencode" | "teencode-to-text">("text-to-teencode");
    const [copied, setCopied] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Custom mapping state
    const [customMapping, setCustomMapping] = useState<Map<string, string>>(
        () => {
            const saved = localStorage.getItem("customTeencodeMapping");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const map = new Map<string, string>();
                    for (const [k, v] of Object.entries(parsed)) {
                        map.set(k, v as string);
                    }
                    return map;
                } catch (e) {
                    console.error("Failed to load custom mapping", e);
                }
            }
            return new Map<string, string>();
        },
    );

    useEffect(() => {
        if (mode === "text-to-teencode") {
            setOutputText(convertToTeencode(inputText, customMapping));
        } else {
            setOutputText(convertFromTeencode(inputText, customMapping));
        }
    }, [inputText, customMapping, mode]);

    const handleCopy = async () => {
        if (!outputText) return;
        try {
            await navigator.clipboard.writeText(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleMappingChange = (key: string, value: string) => {
        const newMap = new Map(customMapping);
        newMap.set(key, value);
        setCustomMapping(newMap);

        // Save to local storage
        const objToSave: Record<string, string> = {};
        newMap.forEach((v, k) => {
            if (v.trim() !== "") {
                objToSave[k] = v;
            }
        });
        localStorage.setItem(
            "customTeencodeMapping",
            JSON.stringify(objToSave),
        );
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Teencode Converter</h1>
                <div className="toolbar">
                    <button
                        className="switch-mode-btn"
                        onClick={() => setMode(prev => prev === "text-to-teencode" ? "teencode-to-text" : "text-to-teencode")}
                    >
                        <span className="switch-icon">⇄</span>{mode === "text-to-teencode" ? "Text → Teencode" : "Teencode → Text"}
                    </button>
                </div>
            </header>

            <div className="workspace">
                <div className="panels">
                    {/* Input Panel */}
                    <div className="panel">
                        <div className="panel-header">
                            <span className="panel-title">{mode === "text-to-teencode" ? "Original Text" : "Teencode Input"}</span>
                        </div>
                        <div className="textarea-wrapper">
                            <textarea
                                className="clean-textarea"
                                placeholder="Enter text to convert..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Output Panel */}
                    <div className="panel">
                        <div className="panel-header">
                            <span className="panel-title">{mode === "text-to-teencode" ? "Teencode Output" : "Text Output"}</span>
                        </div>
                        <div className="text-display-wrapper">
                            {outputText ? (
                                <div className="normal-text-display">
                                    {outputText}
                                </div>
                            ) : (
                                <div className="placeholder-text">
                                    {mode === "text-to-teencode" ? "Teencode for you..." : "Original text for you..."}
                                </div>
                            )}
                            <button
                                className={`copy-btn floating-copy-btn ${copied ? "copied" : ""}`}
                                onClick={handleCopy}
                                disabled={!outputText}
                                aria-label="Copy output"
                            >
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            <div className="settings-workspace">
                <div
                    className="settings-header accordion-header"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                    <div style={{ textAlign: "center", flex: 1 }}>
                        <h2>Customized Teencode</h2>
                    </div>
                    <div
                        className={`accordion-icon ${isSettingsOpen ? "open" : ""}`}
                    >
                        ▼
                    </div>
                </div>
                {isSettingsOpen && (
                    <div className="settings-grid">
                        {Array.from(TENEECODE_MAPPING.entries()).map(
                            ([key, defaultVal]) => {
                                const customVal = customMapping.get(key);
                                const displayVal =
                                    customVal !== undefined ? customVal : "";
                                return (
                                    <div key={key} className="setting-item">
                                        <span className="setting-key">
                                            {key}
                                        </span>
                                        <span className="setting-arrow">→</span>
                                        <input
                                            type="text"
                                            className="setting-input"
                                            value={displayVal}
                                            onChange={(e) =>
                                                handleMappingChange(
                                                    key,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={defaultVal}
                                        />
                                    </div>
                                );
                            },
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
