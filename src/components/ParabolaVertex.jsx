import React, { useState, useEffect } from 'react';
import { Slider } from '../components/ui/slider';

const ParabolaVertex = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [userInputs, setUserInputs] = useState({ xCoord: '', yCoord: '' });
  const [inputStatus, setInputStatus] = useState({ xCoord: null, yCoord: null });
  const [stepCompleted, setStepCompleted] = useState({ xCoord: false, yCoord: false });
  const [stepSkipped, setStepSkipped] = useState({ xCoord: false, yCoord: false });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [calculation, setCalculation] = useState(null);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [isGlowActive, setIsGlowActive] = useState(true);

  useEffect(() => {
    if (stepCompleted.xCoord && stepCompleted.yCoord) {
      if (currentStepIndex === 2) {
        setShowNavigationButtons(true);
      }
    } else {
      setShowNavigationButtons(false);
    }
  }, [stepCompleted, currentStepIndex]);

  const updateCoefficient = (setter) => (value) => {
    setter(value[0]);
    // Reset calculation state when coefficients change
    setCalculation(null);
    setCurrentStepIndex(0);
    setUserInputs({ xCoord: '', yCoord: '' });
    setInputStatus({ xCoord: null, yCoord: null });
    setStepCompleted({ xCoord: false, yCoord: false });
    setStepSkipped({ xCoord: false, yCoord: false });
    setIsGlowActive(true);
  };

  const getCurrentVertex = () => {
    const x = -b / (2 * a);
    return {
      h: x,
      k: a * Math.pow(x, 2) + b * x + c
    };
  };

  const calculateVertex = () => {
    const x = -b / (2 * a);
    const y = a * Math.pow(x, 2) + b * x + c;
    
    setCalculation({
      h: x.toFixed(4),
      k: y.toFixed(4)
    });
    setCurrentStepIndex(0);
    setUserInputs({ xCoord: '', yCoord: '' });
    setInputStatus({ xCoord: null, yCoord: null });
    setStepCompleted({ xCoord: false, yCoord: false });
    setStepSkipped({ xCoord: false, yCoord: false });
    setIsGlowActive(false);
  };

  const handleStepInputChange = (e, field) => {
    setUserInputs({ ...userInputs, [field]: e.target.value });
    setInputStatus({ ...inputStatus, [field]: null });
  };

  const checkStep = (field) => {
    const vertex = getCurrentVertex();
    let isCorrect = false;
    
    if (field === 'xCoord') {
      isCorrect = Math.abs(parseFloat(userInputs.xCoord) - vertex.h) < 0.01;
    } else if (field === 'yCoord') {
      isCorrect = Math.abs(parseFloat(userInputs.yCoord) - vertex.k) < 0.01;
    }

    setInputStatus({ ...inputStatus, [field]: isCorrect ? 'correct' : 'incorrect' });
    if (isCorrect) {
      setStepCompleted(prev => ({ ...prev, [field]: true }));
      setStepSkipped(prev => ({ ...prev, [field]: false }));
    }
  };

  const skipStep = (field) => {
    const vertex = getCurrentVertex();
    setUserInputs({ 
      ...userInputs, 
      [field]: field === 'xCoord' ? vertex.h.toFixed(4) : vertex.k.toFixed(4) 
    });
    setInputStatus({ ...inputStatus, [field]: 'correct' });
    setStepCompleted(prev => ({ ...prev, [field]: true }));
    setStepSkipped(prev => ({ ...prev, [field]: true }));
  };

  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < 2) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Parabola Vertex Calculator</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded">
              <div className="flex items-center">
                <p className="font-semibold text-purple-700 w-90">Current Equation:</p>
                <p className="text-purple-600 text-xl flex-1 text-center">
                  y = {a}x² {b >= 0 ? '+' : ''}{b}x {c >= 0 ? '+' : ''}{c}
                </p>
              </div>
              <div className="mt-2 text-sm text-purple-600 grid grid-cols-3 gap-2 text-center pt-2 border-t border-purple-200">
                <div>a = {a}</div>
                <div>b = {b}</div>
                <div>c = {c}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  a (opens up/down):
                </label>
                <Slider
                  min={-10}
                  max={10}
                  step={0.5}
                  value={[a]}
                  onValueChange={updateCoefficient(setA)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  b (horizontal shift):
                </label>
                <Slider
                  min={-10}
                  max={10}
                  step={0.5}
                  value={[b]}
                  onValueChange={updateCoefficient(setB)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  c (vertical shift):
                </label>
                <Slider
                  min={-10}
                  max={10}
                  step={0.5}
                  value={[c]}
                  onValueChange={updateCoefficient(setC)}
                  className="w-full"
                />
              </div>
            </div>

            <div className={`glow-button ${isGlowActive ? 'simple-glow' : 'simple-glow stopped'}`}>
              <button 
                onClick={calculateVertex} 
                className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded"
              >
                Find the Vertex
              </button>
            </div>
          </div>
        </div>
        
        {calculation && (
          <div className="p-4 bg-gray-50">
            <div className="space-y-2">
              <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                Steps to find the vertex:
              </h3>
              <div className="space-y-4">
                <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                  {currentStepIndex === 0 ? (
                    <>
                      <p className="text-sm">Step 1: Find x-coordinate using the formula x = -b/2a</p>
                      <pre className="text-sm whitespace-pre-wrap mt-1">
                        x = -({b})/(2 × {a})
                      </pre>
                      {stepCompleted.xCoord ? (
                        <p className="text-sm text-[#008545] font-medium mt-1">
                          x = {calculation.h}
                        </p>
                      ) : (
                        <div className="flex items-center space-x-1 mt-2">
                          <input
                            type="number"
                            value={userInputs.xCoord}
                            onChange={(e) => handleStepInputChange(e, 'xCoord')}
                            placeholder="Enter x-coordinate"
                            className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                              inputStatus.xCoord === 'correct'
                                ? 'border-green-500'
                                : inputStatus.xCoord === 'incorrect'
                                ? 'border-yellow-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <div className="glow-button simple-glow">
                            <div className="flex gap-1">
                              <button 
                                onClick={() => checkStep('xCoord')} 
                                className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                              >
                                Check
                              </button>
                              <button 
                                onClick={() => skipStep('xCoord')} 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {stepCompleted.xCoord && !showNavigationButtons && (
                        <div className="flex items-center gap-4 mt-2 justify-end">
                          {!stepSkipped.xCoord && (
                            <span className="text-green-600 font-bold select-none">Great Job!</span>
                          )}
                          <div className="glow-button simple-glow">
                            <button 
                              onClick={() => setCurrentStepIndex(1)}
                              className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : currentStepIndex === 1 ? (
                    <>
                      <p className="text-sm">Step 2: Find y-coordinate by substituting x into the original equation</p>
                      <pre className="text-sm whitespace-pre-wrap mt-1">
                        y = {a}({calculation.h})² {b >= 0 ? '+' : ''}{b}({calculation.h}) {c >= 0 ? '+' : ''}{c}
                      </pre>
                      {stepCompleted.yCoord ? (
                        <p className="text-sm text-[#008545] font-medium mt-1">
                          y = {calculation.k}
                        </p>
                      ) : (
                        <div className="flex items-center space-x-1 mt-2">
                          <input
                            type="number"
                            value={userInputs.yCoord}
                            onChange={(e) => handleStepInputChange(e, 'yCoord')}
                            placeholder="Enter y-coordinate"
                            className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                              inputStatus.yCoord === 'correct'
                                ? 'border-green-500'
                                : inputStatus.yCoord === 'incorrect'
                                ? 'border-yellow-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <div className="glow-button simple-glow">
                            <div className="flex gap-1">
                              <button 
                                onClick={() => checkStep('yCoord')} 
                                className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                              >
                                Check
                              </button>
                              <button 
                                onClick={() => skipStep('yCoord')} 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {stepCompleted.yCoord && !showNavigationButtons && (
                        <div className="flex items-center gap-4 mt-2 justify-end">
                          {!stepSkipped.yCoord && (
                            <span className="text-green-600 font-bold select-none">Great Job!</span>
                          )}
                          <div className="glow-button simple-glow">
                            <button 
                              onClick={() => setCurrentStepIndex(2)}
                              className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm">Step 3: Final Result</p>
                      <div className="mt-2 flex justify-center items-center gap-1">
                        <p className="text-[#008545] text-xl font-bold">
                          Vertex: ({calculation.h}, {calculation.k})
                        </p>
                      </div>
                      <p className="text-sm text-center mt-2 text-gray-600">
                        This is a {a > 0 ? "minimum" : "maximum"} point because a {a > 0 ? "> 0" : "< 0"}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('back')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 min-w-[100px] text-center">
                    Step {currentStepIndex + 1} of 3
                  </span>
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex < 2 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex < 2 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex < 2 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('forward')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ParabolaVertex;