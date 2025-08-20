import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestChallenges() {
  const [step, setStep] = useState('browse');
  const [challenge, setChallenge] = useState(null);

  const startChallenge = () => {
    console.log('Starting test challenge');
    setChallenge({ title: 'Test Challenge' });
    setStep('instructions');
  };

  console.log('Current step:', step);

  if (step === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Challenge Instructions</h1>
        <p>This is the instructions page for the test challenge.</p>
        <Button onClick={() => setStep('attempt')} className="mt-4">
          Start Challenge
        </Button>
      </div>
    );
  }

  if (step === 'attempt') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Challenge Attempt</h1>
        <p>This is where you would complete the challenge.</p>
        <Button onClick={() => setStep('browse')} className="mt-4">
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Skills Challenges - Working Demo</h1>
      <p className="mb-6 text-gray-600">This page loads correctly and demonstrates the challenge flow works.</p>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Communication Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Handle a difficult client communication scenario</p>
            <Button onClick={startChallenge}>
              Start Challenge
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Media Planning Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Plan an advertising campaign with £10,000 budget</p>
            <Button onClick={startChallenge}>
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}