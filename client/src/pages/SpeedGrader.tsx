import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Clock, User, Calendar, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';

interface Submission {
  id: number;
  studentId: number;
  submittedAt: string;
  isLate: boolean;
  status: string;
  fileUrl?: string;
  fileName?: string;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  grade?: {
    totalScore: string;
    percentage: string;
    letterGrade: string;
  };
}

export default function SpeedGrader() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Grading state
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(Date.now());

  // Get assignment ID from URL params
  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get('assignment');

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  useEffect(() => {
    // Reset timer when switching submissions
    setStartTime(Date.now());

    // Load existing grade if present
    const current = submissions[currentIndex];
    if (current?.grade) {
      setScore(current.grade.totalScore);
      // Note: feedback would need to be loaded separately if stored
    } else {
      setScore('');
      setFeedback('');
    }
  }, [currentIndex, submissions]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignments/${assignmentId}/submissions`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSubmit = async (returnToStudent: boolean = false) => {
    const current = submissions[currentIndex];
    if (!current || !score) return;

    try {
      setIsSaving(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: current.id,
          totalScore: parseFloat(score),
          totalPoints: 100, // This would come from the assignment
          feedbackText: feedback,
          returnToStudent,
          timeSpentGrading: timeSpent,
        }),
      });

      if (!response.ok) throw new Error('Failed to save grade');

      toast({
        title: 'Success',
        description: returnToStudent
          ? 'Grade saved and returned to student'
          : 'Grade saved successfully',
      });

      // Move to next submission if available
      if (currentIndex < submissions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All done, refresh to show updated status
        await fetchSubmissions();
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({
        title: 'Error',
        description: 'Failed to save grade',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentSubmission = submissions[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Submissions Yet</h2>
        <p className="text-muted-foreground mb-4">Students haven't submitted any work for this assignment.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/teacher')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">SpeedGrader</h1>
            <p className="text-sm text-muted-foreground">
              Submission {currentIndex + 1} of {submissions.length}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            {currentIndex + 1} / {submissions.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(submissions.length - 1, currentIndex + 1))}
            disabled={currentIndex === submissions.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Submissions List Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">All Submissions</h3>
            <div className="space-y-2">
              {submissions.map((sub, index) => (
                <Card
                  key={sub.id}
                  className={`cursor-pointer transition-colors ${
                    index === currentIndex
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {sub.student?.firstName} {sub.student?.lastName}
                        </span>
                      </div>
                      {sub.grade ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>
                      {sub.isLate && (
                        <Badge variant="destructive" className="text-xs">
                          Late
                        </Badge>
                      )}
                      {sub.grade && (
                        <Badge variant="secondary" className="text-xs">
                          {sub.grade.letterGrade} ({sub.grade.percentage}%)
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Viewer */}
          <div className="flex-1 bg-gray-100 overflow-auto p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentSubmission?.student?.firstName}{' '}
                      {currentSubmission?.student?.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentSubmission?.student?.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {currentSubmission?.isLate && (
                      <Badge variant="destructive">Late Submission</Badge>
                    )}
                    <Badge variant={currentSubmission?.grade ? 'default' : 'secondary'}>
                      {currentSubmission?.grade ? 'Graded' : 'Not Graded'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentSubmission?.fileUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{currentSubmission.fileName}</span>
                    </div>

                    {/* File Preview */}
                    {currentSubmission.fileUrl.endsWith('.pdf') ? (
                      <embed
                        src={currentSubmission.fileUrl}
                        type="application/pdf"
                        className="w-full h-[600px] border rounded"
                      />
                    ) : currentSubmission.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={currentSubmission.fileUrl}
                        alt="Submission"
                        className="max-w-full border rounded"
                      />
                    ) : (
                      <div className="border rounded p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Preview not available for this file type
                        </p>
                        <Button asChild>
                          <a href={currentSubmission.fileUrl} download>
                            Download File
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3" />
                    <p>No file submitted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Grading Panel */}
          <div className="w-96 bg-white border-l overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Grade Submission</h3>

                {/* Score Input */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Score (out of 100)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                    className="text-lg"
                  />
                  {score && (
                    <p className="text-sm text-muted-foreground">
                      {((parseFloat(score) / 100) * 100).toFixed(1)}% -{' '}
                      {calculateLetterGrade((parseFloat(score) / 100) * 100)}
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Feedback */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <Separator className="my-4" />

                {/* Time Spent */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4" />
                  <span>
                    Time on this submission:{' '}
                    {Math.floor((Date.now() - startTime) / 1000 / 60)} min
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handleGradeSubmit(false)}
                    disabled={!score || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Grade'
                    )}
                  </Button>
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => handleGradeSubmit(true)}
                    disabled={!score || isSaving}
                  >
                    Save & Return to Student
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      if (currentIndex < submissions.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                      }
                    }}
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>

              {/* Stats */}
              {currentSubmission?.grade && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 text-sm">Current Grade</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-center mb-2">
                      {currentSubmission.grade.letterGrade}
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      {currentSubmission.grade.totalScore} / 100 (
                      {currentSubmission.grade.percentage}%)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateLetterGrade(percentage: number): string {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}
