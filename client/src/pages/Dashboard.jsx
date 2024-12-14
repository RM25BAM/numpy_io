import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import "../pages/Dashboard.css";
import "../App.css";

const ResultPopup = ({ onClose, result, plotPath, details, mode }) => (
    <div className="popup-background">
        <div className="popup-content">
            <button className="popup-close-btn" onClick={onClose}>
                &times;
            </button>
            <h2>Results</h2>
            <p>{result}</p>
            {plotPath && (
                <img
                    src={`http://localhost:8000/${plotPath}`}
                    alt="Plot"
                    className="plot-image"
                />
            )}
            {details && (
                <div className="popup-scrollable-content">
                    {details.interpolatedPoints && (
                        <div>
                            <h3>Interpolated Missing Points</h3>
                            <ul>
                                {details.interpolatedPoints.map((point, index) => (
                                    <li key={index}>
                                        x: {point.x.toFixed(4)}, f(x):{" "}
                                        {point["f(x)"].toFixed(4)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {mode === "Differentiation" && details.derivatives !== undefined && (
                        <div>
                            <h3>Derivatives</h3>
                            <ul>
                                {Object.entries(details.derivatives).map(([method, value], index) => (
                                    <li key={index}>
                                        <strong>{method}:</strong>{" "}
                                        {typeof value === "string" ? value : value.toFixed(4)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {mode === "Integration" && (
                        <div>
                            <h3>Integration Results</h3>
                            {details.trapezoidalResult !== undefined && (
                                <p>
                                    <strong>Trapezoidal Rule Result:</strong>{" "}
                                    {details.trapezoidalResult.toFixed(4)}
                                </p>
                            )}
                            {details.simpsonsResult !== undefined && (
                                <p>
                                    <strong>Simpson's Rule Result:</strong>{" "}
                                    {details.simpsonsResult}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
            <button className="btn" onClick={onClose}>
                Close
            </button>
        </div>
    </div>
);

const Dashboard = () => {
    const [mode, setMode] = useState("Differentiation");
    const [xValues, setXValues] = useState("");
    const [yValues, setYValues] = useState("");
    const [stepSize, setStepSize] = useState("");
    const [point, setPoint] = useState("");
    const [result, setResult] = useState(null);
    const [plotPath, setPlotPath] = useState(null);
    const [details, setDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleSwitchMode = () => {
        setMode((prevMode) =>
            prevMode === "Differentiation" ? "Integration" : "Differentiation"
        );
    };

    const validateInputs = () => {
        if (!xValues.trim() || !yValues.trim() || !stepSize.trim()) {
            setResult("Error: All fields must be filled out.");
            setShowPopup(true);
            return false;
        }
        if (mode === "Differentiation" && (!point.trim() || isNaN(parseFloat(point)))) {
            setResult("Error: Point must be a valid number for differentiation.");
            setShowPopup(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) return;

        const baseUrl =
            mode === "Differentiation"
                ? "http://localhost:8000/numerical-differentiation"
                : "http://localhost:8000/numerical-integration";

        const data = {
            xValues: xValues.split(" ").map(Number),
            yValues: yValues.split(" ").map(Number),
            stepSize: parseFloat(stepSize),
            point: mode === "Differentiation" ? parseFloat(point) : null,
        };

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();

            if (resultData.success) {
                setResult(
                    mode === "Differentiation"
                        ? "Differentiation Complete"
                        : "Integration Complete"
                );
                setPlotPath(resultData.plotPath);
                setDetails({
                    interpolatedPoints: resultData.interpolatedPoints,
                    derivatives: resultData.derivatives,
                    trapezoidalResult: resultData.trapezoidalResult,
                    simpsonsResult: resultData.simpsonsResult,
                });
            } else {
                setResult(`Error: ${resultData.error}`);
            }
            setShowPopup(true);
        } catch (error) {
            setResult("Error connecting to backend");
            setShowPopup(true);
        }
    };

    return (
        <div className="app-background">
            <div className="form-container">
                <h2 className="dashboard-title">Dashboard</h2>
                <div className="mode-container">
                    <button className="btn" onClick={handleSwitchMode}>
                        Switch to{" "}
                        {mode === "Differentiation" ? "Integration" : "Differentiation"}
                    </button>
                </div>

                <div className="content-container">
                    {mode === "Differentiation" && (
                        <div>
                            <p className="section-title">Numerical Differentiation</p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={xValues}
                                    onChange={(e) => setXValues(e.target.value)}
                                    placeholder="x-coordinates separated by spaces"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={yValues}
                                    onChange={(e) => setYValues(e.target.value)}
                                    placeholder="y-coordinates separated by spaces"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={stepSize}
                                    onChange={(e) => setStepSize(e.target.value)}
                                    placeholder="Enter the step size (h)"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => setPoint(e.target.value)}
                                    placeholder="Point to evaluate the derivative"
                                    required
                                />
                            </div>
                            <button className="btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    )}

                    {mode === "Integration" && (
                        <div>
                            <p className="section-title">Numerical Integration</p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={xValues}
                                    onChange={(e) => setXValues(e.target.value)}
                                    placeholder="x-coordinates separated by spaces"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={yValues}
                                    onChange={(e) => setYValues(e.target.value)}
                                    placeholder="y-coordinates separated by spaces"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={stepSize}
                                    onChange={(e) => setStepSize(e.target.value)}
                                    placeholder="Enter the step size (h)"
                                    required
                                />
                            </div>
                            <button className="btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showPopup && (
                <ResultPopup
                    onClose={() => setShowPopup(false)}
                    result={result}
                    plotPath={plotPath}
                    details={details}
                    mode={mode}
                />
            )}

            <div className="spline-background">
                <Spline scene="https://prod.spline.design/bR9-6jrTvKSKM41g/scene.splinecode" />
            </div>
        </div>
    );
};

export default Dashboard;
