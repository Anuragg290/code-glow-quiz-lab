
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code, Database, Shield, Globe, Cpu, Server, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';

const quizCategories = [
  {
    id: 'programming-basics',
    title: 'Programming Basics',
    description: 'Fundamentals of coding and programming concepts',
    icon: Code,
    color: 'from-purple-500 to-blue-500',
    questionsCount: 25
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    description: 'Sorting, searching, trees, graphs, and complexity',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    questionsCount: 30
  },
  {
    id: 'computer-architecture',
    title: 'Computer Architecture',
    description: 'CPU design, memory systems, and hardware concepts',
    icon: Cpu,
    color: 'from-cyan-500 to-green-500',
    questionsCount: 20
  },
  {
    id: 'databases',
    title: 'Database Systems',
    description: 'SQL, NoSQL, database design and optimization',
    icon: Database,
    color: 'from-green-500 to-purple-500',
    questionsCount: 22
  },
  {
    id: 'networking',
    title: 'Networking',
    description: 'Network protocols, TCP/IP, and distributed systems',
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
    questionsCount: 18
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Security principles, cryptography, and threat analysis',
    icon: Shield,
    color: 'from-pink-500 to-red-500',
    questionsCount: 24
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems',
    description: 'Process management, memory, and system calls',
    icon: Server,
    color: 'from-red-500 to-orange-500',
    questionsCount: 26
  },
  {
    id: 'cs-history',
    title: 'CS History & Pioneers',
    description: 'Timeline of computing milestones and famous figures',
    icon: Clock,
    color: 'from-orange-500 to-yellow-500',
    questionsCount: 15
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <div className="absolute top-4 right-4 z-10">
        <UserMenu />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 animate-fade-in">
              QuizCS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animate-fade-in">
              Master Computer Science through interactive quizzes and challenges. 
              Test your knowledge, track your progress, and level up your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Dashboard
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => navigate('/history')}
                  >
                    Quiz History
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                    onClick={() => navigate('/auth')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => navigate('/history')}
                  >
                    Explore CS History
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Challenge</h2>
          <p className="text-xl text-gray-400">Select a category to start your quiz journey</p>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              Sign in to track your progress and save your scores
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quizCategories.map((category, index) => (
            <Card 
              key={category.id}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/quiz/${category.id}`)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} p-2.5 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-full h-full text-white" />
                </div>
                <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors duration-300">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{category.questionsCount} questions</span>
                  <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-medium`}>
                    Start Quiz
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why QuizCS?</h2>
          <p className="text-xl text-gray-400">Everything you need to excel in Computer Science</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Adaptive Learning</h3>
            <p className="text-gray-400">Questions adapt to your skill level and learning pace</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Real-time Feedback</h3>
            <p className="text-gray-400">Instant explanations and detailed answer breakdowns</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Progress Tracking</h3>
            <p className="text-gray-400">Monitor your improvement across all CS topics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
