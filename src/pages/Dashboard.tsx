
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

interface QuizAttempt {
  id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  category_id: string;
  quiz_categories: {
    name: string;
    color: string;
  };
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: recentAttempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ['recent-attempts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz_categories (name, color)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as QuizAttempt[];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalAttempts = data.length;
      const totalScore = data.reduce((sum, attempt) => sum + attempt.score, 0);
      const totalQuestions = data.reduce((sum, attempt) => sum + attempt.total_questions, 0);
      const averageScore = totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(1) : '0';

      return {
        totalAttempts,
        averageScore: parseFloat(averageScore),
        totalQuestions,
      };
    },
    enabled: !!user,
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back to Quizzes
            </Button>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <UserMenu />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-400">Ready to continue your Computer Science journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Quizzes</CardTitle>
              <Trophy className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalAttempts || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.averageScore || 0}%</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Questions Answered</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalQuestions || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-purple-400" />
              Recent Quiz Attempts
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your latest quiz performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attemptsLoading ? (
              <div className="text-gray-400">Loading recent attempts...</div>
            ) : recentAttempts?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No quiz attempts yet!</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Take Your First Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts?.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${attempt.quiz_categories.color}`} />
                      <div>
                        <p className="text-white font-medium">{attempt.quiz_categories.name}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {attempt.score}/{attempt.total_questions}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {Math.round((attempt.score / attempt.total_questions) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/history')}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    View All History
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
