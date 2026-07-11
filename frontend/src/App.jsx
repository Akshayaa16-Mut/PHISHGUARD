import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanTime, setScanTime] = useState(null);
  const [activePage, setActivePage] = useState("scan");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scanUrl = async () => {
    if (!url.trim()) {
      setErrorMessage("URL REQUIRED // ENTER A TARGET URL");
      setResult(null);
      return;
    }
    try {
      const parsedUrl = new URL(url);

      if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
       ) {
          throw new Error("Invalid protocol");
      }
    } catch {
      setErrorMessage(
        "INVALID URL FORMAT // USE HTTP:// OR HTTPS://"
      );
      setResult(null);
      return;
    }
    setErrorMessage("");
    setIsScanning(true);
    const scanStartTime = performance.now();
    try {
      const response = await fetch("http://phishguard-myb6.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();

      console.log(data);
      setResult(data);
      const scanEndTime = performance.now();

      const duration = (
     (scanEndTime - scanStartTime) / 1000
      ).toFixed(2);

      setScanTime(duration);
      setIsScanning(false);
    } catch (error) {
      console.error("Scan failed:", error);
      setIsScanning(false);
    }
  };

  return (
  <>
    <aside
      className={`cyber-sidebar-overlay ${
        sidebarOpen ? "open" : ""
      }`}
    >
      <button
        className="sidebar-toggle"
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "×" : "☰"}
      </button>

      <div className="overlay-sidebar-brand">
        <span>◈</span>

        {sidebarOpen && (
          <div>
            <strong>PHISHGUARD</strong>
            <p>THREAT INTELLIGENCE</p>
          </div>
        )}
      </div>

      <nav className="overlay-sidebar-nav">
        <button
          type="button"
          className={activePage === "scan" ? "active" : ""}
          onClick={() => setActivePage("scan")}
        >
          <span>01</span>
          {sidebarOpen && "SCAN"}
        </button>

        <button
          type="button"
          className={activePage === "analysis" ? "active" : ""}
          onClick={() => setActivePage("analysis")}
        >
          <span>02</span>
          {sidebarOpen && "URL ANALYSIS"}
        </button>

        <button
          type="button"
          className={activePage === "report" ? "active" : ""}
          onClick={() => setActivePage("report")}
        >
          <span>03</span>
          {sidebarOpen && "THREAT REPORT"}
        </button>

        <button
          type="button"
          className={activePage === "model" ? "active" : ""}
          onClick={() => setActivePage("model")}
        >
          <span>04</span>
          {sidebarOpen && "MODEL LAB"}
        </button>
      </nav>
    </aside>
    {activePage === "scan" && (
    <main className="cyber-app">
      <header className="hud-header">
        <div className="brand">
          <span className="brand-mark">◈</span>

          <div>
            <h1>PHISHGUARD</h1>
            <p>URL INTELLIGENCE SYSTEM</p>
          </div>
        </div>

        <nav className="hud-nav">
          <span>SCANNER</span>
          <span>ENGINE</span>
          <span>ABOUT</span>
        </nav>

        <div className="system-status">
          <span className="status-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <section className="hero">
        <p className="section-code">
          SYSTEM // URL THREAT ANALYSIS
        </p>

        <h2>
          DETECT THE <span>THREAT</span>
          <br />
          BEFORE THE CLICK.
        </h2>

        <p className="hero-description">
          Machine learning powered phishing URL detection using
          17 validated URL intelligence signals.
        </p>
      </section>

      <section className="scanner-hud">
        <div className="hud-label">
          TARGET SCANNER // 01
        </div>

        <div className="scanner-content">
          <label htmlFor="url">
            ENTER TARGET URL
          </label>

          <div className="url-command">
            <span>&gt;_</span>

            <input
              id="url"
              type="text"
              placeholder="https://target-url.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />

            <button
              type="button"
              onClick={scanUrl}
              disabled={isScanning}
              className={isScanning ? "scanning" : ""}
            >
               {isScanning ? "ANALYZING..." : "INITIATE SCAN"}
            </button>
          </div>

          <div className="scanner-meta">
            <span>ENGINE // RANDOM FOREST</span>

            <span>
              SIGNALS // 17 VALIDATED FEATURES
            </span>

            <span>STATUS // READY</span>
          </div>
        </div>
      </section>
              {errorMessage && (
        <section className="error-hud">
          <div className="error-code">
            ERR // URL VALIDATION
          </div>

          <div className="error-content">
            <span>!</span>

            <div>
              <strong>SCAN REQUEST REJECTED</strong>
              <p>{errorMessage}</p>
            </div>
          </div>
        </section>
      )}
      {isScanning && (
        <section className="scanning-hud">
          <div className="scanning-header">
            <span>LIVE ANALYSIS // ACTIVE</span>
            <strong>PROCESSING TARGET</strong>
          </div>

          <div className="scanning-core">
            <div className="scanner-orbit">
              <div className="scanner-orbit-inner"></div>
            </div>

            <div className="scanning-info">
              <h3>ANALYZING URL SIGNALS</h3>

              <p>
                EXTRACTING 17 VALIDATED FEATURES //
                RANDOM FOREST ENGINE ACTIVE
              </p>

              <div className="scan-progress">
                <div className="scan-progress-line"></div>
              </div>

              <span>THREAT INTELLIGENCE PROCESSING...</span>
            </div>
          </div>
        </section>
      )}
            {result && (
        <section
          className={`result-hud ${
            result["Risk Level"] === "Low Risk"
              ? "result-safe"
              : result["Risk Level"] === "Medium Risk"
              ? "result-warning"
              : "result-danger"
          }`}
        >
          <div className="hud-label">
            THREAT ANALYSIS // RESULT
          </div>

          <div className="result-dashboard">
            <div className="prediction-panel">
              <span className="result-code">
                PREDICTION // 01
              </span>

              <div className="result-icon">
                {result["Risk Level"] === "Low Risk" ? "✓" : "!"}
              </div>

              <p className="result-status">
                SCAN COMPLETE
              </p>

              <h3>{result.Prediction}</h3>

              <div className="risk-badge">
                {result["Risk Level"]}
              </div>
            </div>

            <div className="risk-panel">
              <span className="result-code">
                PHISHING RISK SCORE
              </span>

              <div className="risk-score"
              style={{
                  "--risk-score": result["Phishing Risk Score"],
                   }}
                   >
                <strong>
                  {result["Phishing Risk Score"]}
                </strong>

                <span>/100</span>
              </div>

              <p>
                {result["Risk Level"] === "Low Risk"
                  ? "LOW RISK"
                  : result["Risk Level"] === "Medium Risk"
                  ? "MEDIUM RISK"
                  : "HIGH RISK"}
              </p>
            </div>

            <div className="model-panel">
              <span className="result-code">
                ML MODEL
              </span>

              <h4>RANDOM FOREST</h4>
              <div className="model-confidence">
              <span>MODEL CONFIDENCE</span>

              <strong>
              {result["Model Confidence"]}%
              </strong>
              </div>

              <p>
                17 VALIDATED URL FEATURES
              </p>

              <span className="model-status">
                ● MODEL ACTIVE
              </span>
            </div>
          </div>

          
                    <div className="analyzed-target">
            <span>ANALYZED TARGET</span>

            <p>{result.URL}</p>
          </div>

          {result["URL Overview"] && (
            <div className="url-overview-hud">
              <div className="overview-header">
                <span>URL OVERVIEW // 02</span>
                <strong>EXTRACTED INTELLIGENCE</strong>
              </div>

            <div
              className={`overview-grid ${
                 result.Prediction === "Phishing URL"
                    ? "overview-phishing"
                    : "overview-legitimate"
              }`}
            >      <div className="overview-item">
                  <span>DOMAIN</span>
                  <strong>{result["URL Overview"]["Domain"]}</strong>
                </div>

                <div className="overview-item">
                  <span>PROTOCOL</span>
                  <strong>{result["URL Overview"]["Protocol"]}</strong>
                </div>

                <div className="overview-item">
                  <span>URL LENGTH</span>
                  <strong>{result["URL Overview"]["URL Length"]}</strong>
                </div>

                <div className="overview-item">
                  <span>DOMAIN LENGTH</span>
                  <strong>{result["URL Overview"]["Domain Length"]}</strong>
                </div>

                <div className="overview-item">
                  <span>DOMAIN IS IP</span>
                  <strong>{result["URL Overview"]["Domain Is IP"]}</strong>
                </div>

                <div className="overview-item">
                  <span>SUBDOMAINS</span>
                  <strong>{result["URL Overview"]["Subdomains"]}</strong>
                </div>

                <div className="overview-item">
                  <span>HTTPS</span>
                  <strong>{result["URL Overview"]["HTTPS"]}</strong>
                </div>

                <div className="overview-item">
                  <span>SUSPICIOUS KEYWORDS</span>
                  <strong>
                    {result["URL Overview"]["Suspicious Keywords"]}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>HYPHEN COUNT</span>
                  <strong>{result["URL Overview"]["Hyphen Count"]}</strong>
                </div>

                <div className="overview-item">
                  <span>SPECIAL CHARACTERS</span>
                  <strong>
                    {result["URL Overview"]["Special Characters"]}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>URL ENTROPY</span>
                  <strong>{result["URL Overview"]["URL Entropy"]}</strong>
                </div>
                              </div>
            </div>
          )}

          {result["Risk Indicators"] && (
            <div className="risk-indicators-hud">
              <div className="indicators-header">
                <span>TOP RISK INDICATORS // 03</span>
                <strong>EXTRACTED SIGNAL ANALYSIS</strong>
              </div>

              <div className="indicators-grid">
                {result["Risk Indicators"].map((indicator, index) => (
                  <div
                    className={`indicator-item severity-${indicator.Severity.toLowerCase()}`}
                    key={`${indicator.Indicator}-${index}`}
                  >
                    <div className="indicator-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="indicator-info">
                      <span>DETECTED SIGNAL</span>

                      <h4>{indicator.Indicator}</h4>

                      <p>VALUE // {indicator.Value}</p>
                    </div>

                    <div className="indicator-severity">
                      {indicator.Severity.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                    {result["Security Recommendations"] && (
            <div className="security-recommendations-hud">
              <div className="recommendations-header">
                <span>SECURITY RECOMMENDATIONS // 04</span>
                <strong>RESPONSE GUIDANCE</strong>
              </div>

              <div className="recommendations-grid">
                {result["Security Recommendations"].map(
                  (recommendation, index) => (
                    <div
                      className="recommendation-item"
                      key={`${recommendation.Title}-${index}`}
                    >
                      <div className="recommendation-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="recommendation-content">
                        <span>SECURITY ACTION</span>

                        <h4>{recommendation.Title}</h4>

                        <p>{recommendation.Message}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        </section>
      )}
      
          <section
  className={`system-line ${
    result
      ? result.Prediction === "Phishing URL"
        ? "system-phishing"
        : "system-legitimate"
      : ""
  }`}
>
  <span>PHISHGUARD CORE</span>

  <div></div>

  <span>
    {result && scanTime
      ? `SCAN COMPLETE // ${result["Risk Level"]} // SCAN TIME ${scanTime}s`
      : "WAITING FOR TARGET"}
  </span>
</section>
        </main>
        )}

    {activePage === "analysis" && (
      <main className="cyber-app analysis-page">
        <header className="analysis-header">
          <p className="section-code">
            INTELLIGENCE // URL SIGNAL ANALYSIS
          </p>

          <h2>URL SIGNAL ANALYSIS</h2>

          <p>
            Deployment-safe feature extraction from the latest
            analyzed URL.
          </p>
        </header>

        {!result ? (
          <section className="analysis-empty">
            <span>NO TARGET DATA</span>

            <h3>SCAN A URL FIRST</h3>

            <p>
              Run the target scanner to extract and analyze
              the 17 validated URL intelligence signals.
            </p>

            <button
              type="button"
              onClick={() => setActivePage("scan")}
            >
              OPEN SCANNER
            </button>
          </section>
        ) : (
          <section className="signal-analysis-grid">
            <div className="signal-analysis-card">
              <span>01</span>
              <p>DOMAIN LENGTH</p>
              <strong>
                {result["URL Overview"]?.["Domain Length"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>02</span>
              <p>DOMAIN IS IP</p>
              <strong>
                {result["URL Overview"]?.["Domain Is IP"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>03</span>
              <p>SUBDOMAINS</p>
              <strong>
                {result["URL Overview"]?.["Subdomains"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>04</span>
              <p>HTTPS</p>
              <strong>
                {result["URL Overview"]?.["HTTPS"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>05</span>
              <p>SUSPICIOUS KEYWORDS</p>
              <strong>
                {result["URL Overview"]?.["Suspicious Keywords"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>06</span>
              <p>HYPHEN COUNT</p>
              <strong>
                {result["URL Overview"]?.["Hyphen Count"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>07</span>
              <p>SPECIAL CHARACTERS</p>
              <strong>
                {result["URL Overview"]?.["Special Characters"]}
              </strong>
            </div>

            <div className="signal-analysis-card">
              <span>08</span>
              <p>URL ENTROPY</p>
              <strong>
                {result["URL Overview"]?.["URL Entropy"]}
              </strong>
            </div>
          </section>
        )}
      </main>
    )}
    {activePage === "report" && (
  <main className="cyber-app threat-report-page">
    <header className="threat-report-header">
      <p className="section-code">
        SECURITY // THREAT ASSESSMENT
      </p>

      <h2>THREAT REPORT</h2>

      <p>
        Machine learning assessment and URL signal
        interpretation for the latest analyzed target.
      </p>
    </header>

    {!result ? (
      <section className="analysis-empty">
        <span>NO THREAT DATA</span>

        <h3>SCAN A URL FIRST</h3>

        <p>
          A threat report is generated after the URL
          intelligence engine completes a scan.
        </p>

        <button
          type="button"
          onClick={() => setActivePage("scan")}
        >
          OPEN SCANNER
        </button>
      </section>
    ) : (
      <section
        className="threat-report-shell"
        style={{
          "--report-color":
            result["Risk Level"] === "Low Risk"
              ? "#00F5C4"
              : result["Risk Level"] === "Medium Risk"
              ? "#FFB020"
              : "#FF3B3B",
        }}
      >
        <div className="threat-report-summary">
          <span>ASSESSMENT // 01</span>

          <h3>{result["Risk Level"]}</h3>

          <strong>
            {result["Phishing Risk Score"]}/100
          </strong>

          <p>{result.Prediction}</p>
        </div>

        <div className="threat-report-signals">
          <span>SIGNAL INTERPRETATION // 02</span>

          <div>
            <p>
              {result["URL Overview"]?.["HTTPS"] === "YES"
                ? "✓ HTTPS protocol detected"
                : "⚠ HTTPS protocol not detected"}
            </p>

            <p>
              {result["URL Overview"]?.["Domain Is IP"] === "NO"
                ? "✓ Domain does not use an IP address"
                : "⚠ IP address detected as domain"}
            </p>

            <p>
              {Number(
                result["URL Overview"]?.["Suspicious Keywords"]
              ) === 0
                ? "✓ No suspicious keywords detected"
                : "⚠ Suspicious keyword pattern detected"}
            </p>

            <p>
              {Number(
                result["URL Overview"]?.["Hyphen Count"]
              ) === 0
                ? "✓ No unusual hyphen pattern detected"
                : "⚠ Hyphen pattern requires attention"}
            </p>
          </div>
        </div>

        <div className="threat-report-recommendation">
          <span>RECOMMENDATION // 03</span>

          <h3>
            {result["Risk Level"] === "Low Risk"
              ? "NO MAJOR URL-BASED PHISHING INDICATORS DETECTED."
              : result["Risk Level"] === "Medium Risk"
              ? "REVIEW THE URL BEFORE PROVIDING SENSITIVE INFORMATION."
              : "AVOID INTERACTING WITH THIS URL."}
          </h3>

          <p>
            ML-based URL assessment. Safety is not guaranteed.
            Verify the website and organization before entering
            passwords, banking details, or personal information.
          </p>
        </div>
      </section>
    )}
  </main>
)}
    {activePage === "model" && (
  <main className="cyber-app model-lab-page">
    <header className="model-lab-header">
      <p className="section-code">
        ENGINE // MACHINE LEARNING INTELLIGENCE
      </p>

      <h2>MODEL LAB</h2>

      <p>
        Deployment model performance, feature engineering
        evolution, and extraction validation.
      </p>
    </header>

    <section className="model-lab-grid">
      <div className="deployment-model-card">
        <span>DEPLOYMENT MODEL // 01</span>

        <h3>RANDOM FOREST</h3>

        <p>
          17-FEATURE DEPLOYMENT-SAFE CLASSIFIER
        </p>

        <div className="model-active-line">
          <span></span>
          MODEL ACTIVE
        </div>
      </div>

      <div className="metric-card">
        <span>ACCURACY</span>
        <strong>99.5560%</strong>
        <p>OVERALL CORRECT PREDICTIONS</p>
      </div>

      <div className="metric-card">
        <span>PRECISION</span>
        <strong>99.3764%</strong>
        <p>PHISHING PREDICTION PRECISION</p>
      </div>

      <div className="metric-card">
        <span>RECALL</span>
        <strong>99.8517%</strong>
        <p>PHISHING DETECTION RECALL</p>
      </div>

      <div className="metric-card">
        <span>F1 SCORE</span>
        <strong>99.6135%</strong>
        <p>PRECISION–RECALL BALANCE</p>
      </div>
    </section>

    <section className="feature-evolution-hud">
      <div className="model-section-header">
        <span>EXPERIMENT // 02</span>
        <strong>FEATURE ENGINEERING EVOLUTION</strong>
      </div>

      <div className="feature-evolution-flow">
        <div>
          <span>BASELINE</span>
          <strong>13</strong>
          <p>FEATURES</p>
        </div>

        <b>→</b>

        <div>
          <span>ENGINEERED</span>
          <strong>21</strong>
          <p>FEATURES</p>
        </div>

        <b>→</b>

        <div className="deployment-feature-stage">
          <span>DEPLOYMENT SAFE</span>
          <strong>17</strong>
          <p>VALIDATED FEATURES</p>
        </div>
      </div>
    </section>

    <section className="feature-validation-hud">
      <div className="model-section-header">
        <span>VALIDATION // 03</span>
        <strong>FEATURE EXTRACTION PARITY</strong>
      </div>

      <div className="validation-score">
        <div>
          <strong>17 / 17</strong>
          <span>FEATURES VALIDATED</span>
        </div>

        <div>
          <strong>100%</strong>
          <span>EXTRACTION MATCH</span>
        </div>

        <p>
          Training-side feature values were compared with
          raw-URL deployment extraction to validate model-input
          consistency.
        </p>
      </div>
    </section>
  </main>
)}
    </>
  );
}

export default App;