import React, { useState } from 'react';
import { Slider } from '../components/ui/slider';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Check, X } from 'lucide-react';

const ParabolaVertex = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [userInputs, setUserInputs] = useState({ xCoord: '', yCoord: '' });
  const [inputStatus, setInputStatus] = useState({ xCoord: null, yCoord: null });
  const [stepCompleted, setStepCompleted] = useState({ xCoord: false, yCoord: false });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [calculation, setCalculation] = useState(null);

  const updateCoefficient = (setter) => (value) => {
    setter(value[0]);
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
      setStepCompleted({ ...stepCompleted, [field]: true });
      if (currentStepIndex < 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const skipStep = (field) => {
    const vertex = getCurrentVertex();
    setUserInputs({ 
      ...userInputs, 
      [field]: field === 'xCoord' ? vertex.h.toFixed(4) : vertex.k.toFixed(4) 
    });
    setInputStatus({ ...inputStatus, [field]: 'correct' });
    setStepCompleted({ ...stepCompleted, [field]: true });
    if (currentStepIndex < 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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

            <div className="p-4 bg-purple-50 rounded">
              <p className="font-semibold text-purple-700 mb-2">Current Equation:</p>
              <p className="text-purple-600 text-xl text-center">
                y = {a}x² {b >= 0 ? '+' : ''}{b}x {c >= 0 ? '+' : ''}{c}
              </p>
              <div className="mt-2 text-sm text-purple-600 grid grid-cols-3 gap-2 text-center pt-2 border-t border-purple-200">
                <div>a = {a}</div>
                <div>b = {b}</div>
                <div>c = {c}</div>
              </div>
            </div>

            <Button onClick={calculateVertex} className="w-full">
              Find the Vertex
            </Button>

            {calculation && (
              <div className="w-full space-y-2">
                <p className="font-semibold text-purple-600">Calculate the Vertex:</p>
                
                <div className="bg-purple-50 p-2 rounded">
                  <p>Step 1: Find x-coordinate using the formula x = -b/2a</p>
                  {stepCompleted.xCoord ? (
                    <p className="text-green-600">x = {calculation.h}</p>
                  ) : (
                    <div className="flex items-center space-x-1 text-sm mt-2">
                      <Input
                        type="number"
                        value={userInputs.xCoord}
                        onChange={(e) => handleStepInputChange(e, 'xCoord')}
                        placeholder="Enter x-coordinate"
                        className="w-44 text-xs px-1 text-left"
                      />
                      <Button onClick={() => checkStep('xCoord')} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                        Check
                      </Button>
                      <Button onClick={() => skipStep('xCoord')} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                        Skip
                      </Button>
                      {inputStatus.xCoord === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                      {inputStatus.xCoord === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                    </div>
                  )}
                </div>

                {(currentStepIndex >= 1 || stepCompleted.xCoord) && (
                  <div className="bg-purple-50 p-2 rounded">
                    <p>Step 2: Find y-coordinate by substituting x into the original equation</p>
                    {stepCompleted.yCoord ? (
                      <p className="text-green-600">y = {calculation.k}</p>
                    ) : (
                      <div className="flex items-center space-x-1 text-sm mt-2">
                        <Input
                          type="number"
                          value={userInputs.yCoord}
                          onChange={(e) => handleStepInputChange(e, 'yCoord')}
                          placeholder="Enter y-coordinate"
                          className="w-32 text-xs px-1 text-left"
                        />
                        <Button onClick={() => checkStep('yCoord')} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                          Check
                        </Button>
                        <Button onClick={() => skipStep('yCoord')} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                          Skip
                        </Button>
                        {inputStatus.yCoord === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                        {inputStatus.yCoord === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                      </div>
                    )}
                  </div>
                )}

                {(stepCompleted.xCoord && stepCompleted.yCoord) && (
                  <div className="bg-green-50 p-2 rounded">
                    <p className="font-medium text-green-700">
                      The vertex is at point ({calculation.h}, {calculation.k})
                    </p>
                    <p className="text-green-600">
                      This is a {a > 0 ? "minimum" : "maximum"} point because a {a > 0 ? "> 0" : "< 0"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParabolaVertex;