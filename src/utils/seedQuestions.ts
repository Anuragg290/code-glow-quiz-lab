
import { supabase } from '@/integrations/supabase/client';

const sampleQuestions = [
  {
    category: 'Programming Basics',
    questions: [
      {
        question: "Which of the following is NOT a primitive data type in most programming languages?",
        options: ["Integer", "Boolean", "String", "Array"],
        correct_answer: 3,
        explanation: "Array is a composite data type that holds multiple values, while Integer, Boolean, and String are primitive types that hold single values."
      },
      {
        question: "What does 'DRY' principle stand for in programming?",
        options: ["Don't Repeat Yourself", "Data Requires Yielding", "Direct Resource Yielding", "Dynamic Resource Yielding"],
        correct_answer: 0,
        explanation: "DRY stands for 'Don't Repeat Yourself' - a principle that encourages reducing repetition in code by abstracting common functionality."
      },
      {
        question: "Which of these is the correct way to declare a constant in most C-style languages?",
        options: ["var PI = 3.14", "const PI = 3.14", "let PI = 3.14", "constant PI = 3.14"],
        correct_answer: 1,
        explanation: "The 'const' keyword is used to declare constants in most C-style languages like JavaScript, C++, and others."
      }
    ]
  },
  {
    category: 'Algorithms & Data Structures',
    questions: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct_answer: 1,
        explanation: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step."
      },
      {
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        correct_answer: 2,
        explanation: "Merge Sort has O(n log n) time complexity in all cases (best, average, and worst), making it consistently efficient."
      },
      {
        question: "What data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct_answer: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed."
      }
    ]
  }
];

export const seedQuestions = async () => {
  try {
    // Get categories
    const { data: categories, error: categoriesError } = await supabase
      .from('quiz_categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;

    // Check if questions already exist
    const { data: existingQuestions } = await supabase
      .from('quiz_questions')
      .select('id')
      .limit(1);

    if (existingQuestions && existingQuestions.length > 0) {
      console.log('Questions already exist, skipping seed');
      return;
    }

    // Insert questions for each category
    for (const sampleCategory of sampleQuestions) {
      const category = categories?.find(c => c.name === sampleCategory.category);
      if (!category) continue;

      const questionsToInsert = sampleCategory.questions.map(q => ({
        category_id: category.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: 'medium'
      }));

      const { error } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (error) throw error;
    }

    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};
