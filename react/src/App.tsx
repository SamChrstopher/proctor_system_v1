import React, { useState, useEffect } from "react";
import WebcamCapture from "./components/WebcamCapture";
import Navbar from "./components/Navbar";
import Alerts from "./components/Alerts";
import AgreementModal from "./components/AgreementModal";
import CountdownTimer from "./components/CountdownTimer";

interface MalpracticeEntry {
  message: string;
  imageUrl: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAgreement, setShowAgreement] = useState<boolean>(true);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [malpracticeCount, setMalpracticeCount] = useState<number>(0);
  const [malpracticeData, setMalpracticeData] = useState<MalpracticeEntry[]>([]);
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  const [applicantId, setApplicantId] = useState<string>("");

  useEffect(() => {
    setApplicantId(`user_${Math.floor(Math.random() * 1000)}`);
  }, []);

  const handleAgree = (): void => {
    setShowAgreement(false);
  };

  const handleExit = (): void => {
    if (window.confirm("Are you sure you want to exit the test? This will end your session.")) {
      resetTest();
    }
  };

  const resetTest = (): void => {
    setCapturedImage(null);
    setAlertMessage("");
    setShowAgreement(true);
    setIsTestStarted(false);
    setIsTestCompleted(false);
    setMalpracticeCount(0);
    setMalpracticeData([]);
    setVerificationComplete(false);
    setApplicantId(`user_${Math.floor(Math.random() * 1000)}`);
  };

  const handleMalpracticeDetected = (message: string, imageUrl: string): void => {
    if (verificationComplete) {
      const newCount = malpracticeCount + 1;
      setMalpracticeCount(newCount);
      setMalpracticeData((prev) => [
        ...prev,
        { message, imageUrl, timestamp: new Date().toISOString() },
      ]);

      if (newCount >= 5) {
        setAlertMessage("❌ Test terminated due to multiple malpractices.");
        setIsTestCompleted(true);
        setTimeout(() => {
          resetTest();
        }, 5000);
      }
    }
  };

  const handleTimeComplete = (): void => {
    setIsTestCompleted(true);
    setAlertMessage("✅ Test completed successfully!");
  };

  const handleVerificationComplete = (): void => {
    setVerificationComplete(true);
    setIsTestStarted(true);
    setAlertMessage("✅ Verification complete - Test started!");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showAgreement ? (
        <AgreementModal onAgree={handleAgree} />
      ) : (
        <>
          <Navbar capturedImage={capturedImage} onExit={handleExit} />

          <div style={{ padding: "20px", flex: 1 }}>
            {isTestStarted && !isTestCompleted && (
              <>
                <CountdownTimer duration={2} onComplete={handleTimeComplete} />
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  Violations: {malpracticeCount}/5
                </div>
              </>
            )}

            <WebcamCapture
              setCapturedImage={setCapturedImage}
              setAlertMessage={setAlertMessage}
              onMalpracticeDetected={handleMalpracticeDetected}
              isTestStarted={isTestStarted}
              isTestCompleted={isTestCompleted}
              onVerificationComplete={handleVerificationComplete}
              applicantId={applicantId}
            />
          </div>

          <Alerts message={alertMessage} />
        </>
      )}
    </div>
  );
};

export default App;
