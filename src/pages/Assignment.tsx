import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple-choice' | 'written' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  maxPoints: number;
  answer?: string;
}

const Assignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [submitted, setSubmitted] = useState(false);

  // Demo assignment data
  const assignment = {
    id: 'assignment-1',
    title: 'Physics Chapter 3: Forces and Motion',
    description: 'Test your understanding of Newton\'s laws and force calculations.',
    course: 'Physics 101',
    instructor: 'Dr. Sarah Johnson',
    dueDate: new Date('2024-03-15T23:59:59'),
    timeLimit: 45,
    maxPoints: 100,
    attempts: 1,
    questions: [
      {
        id: '1',
        type: 'multiple-choice' as const,
        question: 'What is Newton\'s First Law of Motion?',
        options: [
          'An object at rest stays at rest unless acted upon by a force',
          'Force equals mass times acceleration',
          'For every action there is an equal and opposite reaction',
          'Energy cannot be created or destroyed'
        ],
        correctAnswer: 'An object at rest stays at rest unless acted upon by a force',
        maxPoints: 10
      },
      {
        id: '2',
        type: 'multiple-choice' as const,
        question: 'If a 5kg object experiences a force of 20N, what is its acceleration?',
        options: [
          '2 m/s²',
          '4 m/s²',
          '25 m/s²',
          '100 m/s²'
        ],
        correctAnswer: '4 m/s²',
        maxPoints: 15
      },
      {
        id: '3',
        type: 'true-false' as const,
        question: 'Friction always opposes motion.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        maxPoints: 10
      },
      {
        id: '4',
        type: 'written' as const,
        question: 'Explain how Newton\'s Third Law applies to walking. Include specific examples of action-reaction pairs in your answer. (Minimum 100 words)',
        maxPoints: 25
      },
      {
        id: '5',
        type: 'written' as const,
        question: 'A car traveling at 30 m/s applies its brakes and comes to a stop in 6 seconds. Calculate the deceleration and the distance traveled during braking. Show all work.',
        maxPoints: 20
      },
      {
        id: '6',
        type: 'multiple-choice' as const,
        question: 'Which of the following is NOT a contact force?',
        options: [
          'Friction',
          'Normal force',
          'Gravitational force',
          'Tension'
        ],
        correctAnswer: 'Gravitational force',
        maxPoints: 10
      },
      {
        id: '7',
        type: 'written' as const,
        question: 'Compare and contrast static friction and kinetic friction. Provide real-world examples of each.',
        maxPoints: 10
      }
    ]
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < assignment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssignment = () => {
    setSubmitted(true);
    toast.success('Assignment submitted successfully!');
    setTimeout(() => {
      navigate('/assignments');
    }, 2000);
  };

  const question = assignment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assignment.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Assignment Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your answers have been saved and submitted for grading.
            </p>
            <Badge variant="outline" className="mb-4">
              {answeredQuestions}/{assignment.questions.length} Questions Answered
            </Badge>
            <p className="text-sm text-muted-foreground">
              Redirecting to assignments page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground">{assignment.course} • {assignment.instructor}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline">
              {answeredQuestions}/{assignment.questions.length} Answered
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Question {currentQuestion + 1} of {assignment.questions.length}
                </CardTitle>
                <Badge variant="secondary">
                  {question.maxPoints} points
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gradient-subtle rounded-lg border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  {question.question}
                </h3>

                {question.type === 'multiple-choice' && question.options && (
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <div className="space-y-3">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.type === 'true-false' && question.options && (
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <div className="flex gap-6">
                      {question.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.type === 'written' && (
                  <div className="space-y-2">
                    <Label>Your Answer:</Label>
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Characters: {(answers[question.id] || '').length}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion === assignment.questions.length - 1 ? (
                  <Button
                    onClick={submitAssignment}
                    className="bg-success hover:bg-success/90"
                    disabled={answeredQuestions === 0}
                  >
                    Submit Assignment
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assignment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Time Limit</div>
                  <div className="font-medium">{assignment.timeLimit} minutes</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                  <div className="font-medium">{assignment.maxPoints} points</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Attempts</div>
                  <div className="font-medium">{assignment.attempts} attempt</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Due Date</div>
                  <div className="font-medium">
                    {assignment.dueDate.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {assignment.questions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={currentQuestion === index ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        answers[q.id] ? 'bg-success hover:bg-success/90' : ''
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border rounded" />
                    <span>Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Answer all questions to the best of your ability</p>
                <p>• You can navigate between questions freely</p>
                <p>• Make sure to submit before time runs out</p>
                <p>• Written answers should be detailed and clear</p>
                <p>• You have only one attempt for this assignment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;