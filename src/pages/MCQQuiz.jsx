import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/ai';

export default function MCQQuiz() {
    const [targetRole, setTargetRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [hasTarget, setHasTarget] = useState(false);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        // Check if target is set
        const storedRole = localStorage.getItem('targetRole');
        const storedCompany = localStorage.getItem('targetCompany');

        if (storedRole && storedCompany) {
            setTargetRole(storedRole);
            setTargetCompany(storedCompany);
            setHasTarget(true);
            generateTopics(storedRole, storedCompany);
        }
    }, []);

    const generateTopics = async (role, company) => {
        setLoading(true);
        try {
            const prompt = `You are a technical interview expert. Generate 5 relevant MCQ quiz topics for a ${role} position at ${company}.

Format your response as a simple list:
1. Topic Name 1
2. Topic Name 2
3. Topic Name 3
4. Topic Name 4
5. Topic Name 5

Make topics specific to the role and technical skills required.`;

            const response = await generateAIResponse(prompt);

            const topicList = response
                .split('\n')
                .filter(line => line.match(/^\d+\./))
                .map(line => line.replace(/^\d+\.\s*/, '').trim());

            setTopics(topicList);
        } catch (error) {
            console.error('Error generating topics:', error);
            setTopics([
                'Data Structures & Algorithms',
                'System Design',
                'Object-Oriented Programming',
                'Database Management',
                'Web Development Fundamentals'
            ]);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async (topic) => {
        setSelectedTopic(topic);
        setLoading(true);

        try {
            const prompt = `Generate 5 multiple choice questions about "${topic}" for a ${targetRole} interview at ${targetCompany}.

Format EXACTLY like this:

Q1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
CORRECT: [A/B/C/D]

Q2: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
CORRECT: [A/B/C/D]

Continue for all 5 questions.`;

            const response = await generateAIResponse(prompt);

            const questionMatches = response.matchAll(/Q\d+:\s*(.+?)\nA\)\s*(.+?)\nB\)\s*(.+?)\nC\)\s*(.+?)\nD\)\s*(.+?)\nCORRECT:\s*([A-D])/gs);

            const parsedQuestions = [];
            for (const match of questionMatches) {
                parsedQuestions.push({
                    question: match[1].trim(),
                    options: [
                        { id: 'A', text: match[2].trim() },
                        { id: 'B', text: match[3].trim() },
                        { id: 'C', text: match[4].trim() },
                        { id: 'D', text: match[5].trim() }
                    ],
                    correct: match[6].trim()
                });
            }

            setQuestions(parsedQuestions);
            setQuizStarted(true);
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answerId) => {
        setSelectedAnswer(answerId);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === questions[currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setSelectedTopic(null);
    };

    if (!hasTarget) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }} className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>Set Your Target First</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Please set your target company and role from the dashboard to access the MCQ quiz.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn btn-primary"
                        style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (showResult) {
        const percentage = (score / questions.length) * 100;
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>Quiz Complete!</h1>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                        {score}/{questions.length}
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        You scored {percentage.toFixed(0)}%
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={resetQuiz} className="btn btn-primary">
                            Try Another Topic
                        </button>
                        <button onClick={() => window.location.reload()} className="btn btn-outline">
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (quizStarted && questions.length > 0) {
        const question = questions[currentQuestion];
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                            Topic: {selectedTopic}
                        </span>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', lineHeight: '1.5' }}>
                        {question.question}
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswerSelect(option.id)}
                                style={{
                                    padding: '1.25rem',
                                    textAlign: 'left',
                                    border: `2px solid ${selectedAnswer === option.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    borderRadius: '0.75rem',
                                    backgroundColor: selectedAnswer === option.id ? '#EFF6FF' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedAnswer !== option.id) {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedAnswer !== option.id) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                    }
                                }}
                            >
                                <strong>{option.id})</strong> {option.text}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className="btn btn-primary"
                        style={{ width: '100%', opacity: selectedAnswer ? 1 : 0.5 }}
                    >
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>MCQ Quiz</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                Preparing for <strong>{targetRole}</strong> at <strong>{targetCompany}</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Select a topic to start your quiz.
            </p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <Loader2 size={40} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedTopic ? 'Generating quiz questions...' : 'Loading topics...'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {topics.map((topic, idx) => (
                        <div
                            key={idx}
                            onClick={() => startQuiz(topic)}
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '1.25rem',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{topic}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                5 questions • ~5 minutes
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
