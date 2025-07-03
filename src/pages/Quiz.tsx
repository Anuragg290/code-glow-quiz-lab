
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Sample questions data - in a real app, this would come from an API
const sampleQuestions = {
  'programming-basics': [
    {
      id: 1,
      question: "Which of the following is NOT a primitive data type in most programming languages?",
      options: ["Integer", "Boolean", "String", "Array"],
      correctAnswer: 3,
      explanation: "Array is a composite data type that holds multiple values, while Integer, Boolean, and String are primitive types that hold single values."
    },
    {
      id: 2,
      question: "What does 'DRY' principle stand for in programming?",
      options: ["Don't Repeat Yourself", "Data Requires Yielding", "Direct Resource Yielding", "Dynamic Resource Yielding"],
      correctAnswer: 0,
      explanation: "DRY stands for 'Don't Repeat Yourself' - a principle that encourages reducing repetition in code by abstracting common functionality."
    },
    {
      id: 3,
      question: "Which of these is the correct way to declare a constant in most C-style languages?",
      options: ["var PI = 3.14", "const PI = 3.14", "let PI = 3.14", "constant PI = 3.14"],
      correctAnswer: 1,
      explanation: "The 'const' keyword is used to declare constants in most C-style languages like JavaScript, C++, and others."
    }
  ],
  'algorithms': [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step."
    },
    {
      id: 2,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort has O(n log n) time complexity in all cases (best, average, and worst), making it consistently efficient."
    }
  ]
};

const Quiz = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimedMode, setIsTimedMode] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = sampleQuestions[categoryId as keyof typeof sampleQuestions] || sampleQuestions['programming-basics'];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (isTimedMode && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, isTimedMode, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(userAnswers[currentQuestion + 1] ?? null);
        setShowResult(false);
      } else {
        handleQuizComplete();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1] ?? null);
      setShowResult(false);
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    const score = calculateScore();
    const percentage = (score / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-900/50 border-gray-800 mt-8">
            <CardHeader className="text-center pb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold text-white mb-4">Quiz Complete!</CardTitle>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {score}/{totalQuestions}
              </div>
              <p className="text-2xl text-gray-300">
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">{question.question}</p>
                          <p className="text-sm text-gray-400 mb-2">
                            Your answer: {question.options[userAnswer]} 
                            {!isCorrect && (
                              <span className="text-green-400 ml-2">
                                (Correct: {question.options[question.correctAnswer]})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-300">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-4 mt-8 justify-center">
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  Back to Home
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {isTimedMode && (
            <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-white font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white leading-relaxed">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
