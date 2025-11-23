import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle2, XCircle, ArrowLeft, Award } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function StationTest() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: station } = useQuery({
    queryKey: ['station', id],
    queryFn: async () => {
      const res = await fetch(`/api/stations/${id}`);
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/student-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
    },
  });

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  if (!station) {
    return <div>Loading...</div>;
  }

  const handleStart = () => {
    setStarted(true);
    setTimeElapsed(0);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleSubmit = () => {
    const questions = station.questions as any[];
    let correctCount = 0;

    questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= station.passingScore;

    const resultData = {
      stationId: station.id,
      score,
      timeSpent: timeElapsed,
      passed,
      answers,
    };

    setResult({ ...resultData, correctCount, totalQuestions: questions.length });
    setSubmitted(true);
    submitMutation.mutate(resultData);
  };

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card className={result.passed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {result.passed ? (
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              {result.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{result.score}%</div>
              <p className="text-muted-foreground">
                {result.correctCount} out of {result.totalQuestions} correct
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="text-2xl font-bold">{formatTime(result.timeSpent)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Time</p>
                <p className="text-2xl font-bold">{station.targetTime}:00</p>
              </div>
            </div>

            {result.passed && (
              <div className="p-4 bg-white rounded-lg border-2 border-green-500 text-center">
                <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-900">Certificate Earned!</p>
                <p className="text-sm text-green-700 mt-1">
                  You have successfully completed {station.name}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLocation('/stations')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stations
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setStarted(false);
                  setSubmitted(false);
                  setAnswers({});
                  setTimeElapsed(0);
                  setResult(null);
                }}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => setLocation('/stations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stations
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{station.name}</CardTitle>
            <p className="text-muted-foreground">{station.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-6">
              <Badge variant="outline" className="text-base py-2 px-4">
                <Clock className="w-4 h-4 mr-2" />
                {station.targetTime} minutes
              </Badge>
              <Badge variant="outline" className="text-base py-2 px-4">
                <Award className="w-4 h-4 mr-2" />
                {station.passingScore}% to pass
              </Badge>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <ol className="space-y-3">
                {(station.instructions as string[]).map((instruction: string, idx: number) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Before You Start:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Read all instructions carefully</li>
                <li>You'll have {(station.questions as any[]).length} questions to answer</li>
                <li>Timer starts when you click "Start Test"</li>
                <li>You need {station.passingScore}% to pass</li>
              </ul>
            </div>

            <Button size="lg" className="w-full" onClick={handleStart}>
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = station.questions as any[];
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold">{station.name}</h2>
        <div className="flex items-center gap-2 text-lg font-mono">
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question: any, qIdx: number) => (
          <Card key={qIdx}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {qIdx + 1} of {questions.length}
              </CardTitle>
              <p className="text-base">{question.question}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option: string, oIdx: number) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerSelect(qIdx, oIdx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[qIdx] === oIdx
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[qIdx] === oIdx
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[qIdx] === oIdx && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Test
          </Button>
          {!allAnswered && (
            <p className="text-sm text-center text-muted-foreground mt-2">
              Please answer all questions before submitting
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
