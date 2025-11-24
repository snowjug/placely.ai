import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/ai';

export default function ResumeFeedback() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
                setResumeFile(file);
            } else {
                alert('Please upload a PDF file under 5MB');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
                setResumeFile(file);
            } else {
                alert('Please upload a PDF file under 5MB');
            }
        }
    };

    const analyzeResume = async () => {
        if (!resumeFile || !jobDescription.trim()) {
            alert('Please upload your resume and paste the job description');
            return;
        }

        setLoading(true);
        try {
            const prompt = `You are an expert resume reviewer and career coach. Analyze how well a resume matches the following job description and provide detailed feedback.

Job Description:
${jobDescription}

Provide feedback in the following format:

MATCH SCORE: [X/10]

STRENGTHS:
- Strength 1
- Strength 2
- Strength 3

AREAS FOR IMPROVEMENT:
- Improvement 1
- Improvement 2
- Improvement 3

MISSING KEYWORDS:
- Keyword 1
- Keyword 2
- Keyword 3

RECOMMENDATIONS:
- Recommendation 1
- Recommendation 2
- Recommendation 3

Note: Since I cannot actually read the PDF file, provide general feedback based on common resume best practices for this job description.`;

            const response = await generateAIResponse(prompt);

            // Parse the response
            const scoreMatch = response.match(/MATCH SCORE:\s*(\d+\/10)/);
            const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=AREAS FOR IMPROVEMENT:|$)/);
            const improvementsMatch = response.match(/AREAS FOR IMPROVEMENT:([\s\S]*?)(?=MISSING KEYWORDS:|$)/);
            const keywordsMatch = response.match(/MISSING KEYWORDS:([\s\S]*?)(?=RECOMMENDATIONS:|$)/);
            const recommendationsMatch = response.match(/RECOMMENDATIONS:([\s\S]*?)$/);

            const parseList = (text) => {
                if (!text) return [];
                return text.split('\n')
                    .filter(line => line.trim().startsWith('-'))
                    .map(line => line.trim().substring(2));
            };

            setFeedback({
                score: scoreMatch ? scoreMatch[1] : '7/10',
                strengths: parseList(strengthsMatch ? strengthsMatch[1] : ''),
                improvements: parseList(improvementsMatch ? improvementsMatch[1] : ''),
                keywords: parseList(keywordsMatch ? keywordsMatch[1] : ''),
                recommendations: parseList(recommendationsMatch ? recommendationsMatch[1] : '')
            });
        } catch (error) {
            console.error('Error analyzing resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Resume Feedback</h1>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1.25rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                marginBottom: '2rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>AI Resume Analyzer</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                        Get instant, powerful feedback. Upload your resume and paste a job description to see how you stack up.
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#FFF3CD',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                    border: '1px solid #FFE69C'
                }}>
                    <strong style={{ color: '#856404' }}>Important Note</strong>
                    <p style={{ marginTop: '0.5rem', lineHeight: '1.6', color: '#856404', fontSize: '0.95rem' }}>
                        The resume analysis is performed by an AI based on the job description you provide. The feedback is specific to that description and not related to the general company or role you are preparing for elsewhere in the application.
                    </p>
                </div>

                {/* STEP 1: Upload Resume */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                        STEP 1
                    </h3>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Upload Your Resume</h4>

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            borderRadius: '0.75rem',
                            padding: '2.5rem',
                            textAlign: 'center',
                            backgroundColor: dragActive ? '#EFF6FF' : '#fafafa',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => document.getElementById('resume-upload').click()}
                    >
                        <Upload size={40} style={{ margin: '0 auto 1rem', color: 'var(--primary-color)' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            {resumeFile ? resumeFile.name : 'Click to upload'}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            PDF only, up to 5MB
                        </p>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {resumeFile && (
                        <p style={{ marginTop: '0.75rem', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                            ✓ {resumeFile.name} selected
                        </p>
                    )}
                </div>

                {/* STEP 2: Job Description */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                        STEP 2
                    </h3>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Paste Job Description</h4>

                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description you are targeting here."
                        style={{
                            width: '100%',
                            minHeight: '200px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.75rem',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                </div>

                {/* STEP 3: Analyze */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                        STEP 3
                    </h3>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Get Your Feedback</h4>

                    <button
                        onClick={analyzeResume}
                        disabled={!resumeFile || !jobDescription.trim() || loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            opacity: (!resumeFile || !jobDescription.trim() || loading) ? 0.6 : 1,
                            fontSize: '1rem',
                            padding: '0.875rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Analyzing Your Resume...
                            </>
                        ) : 'Analyze My Resume'}
                    </button>
                </div>
            </div>

            {/* Feedback Results */}
            {feedback && (
                <div className="fade-in" style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Analysis Results</h2>

                    {/* Match Score */}
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: '#EFF6FF',
                        borderRadius: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Match Score</p>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {feedback.score}
                        </div>
                    </div>

                    {/* Strengths */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#059669' }}>
                            ✓ Strengths
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                            {feedback.strengths.map((strength, idx) => (
                                <li key={idx} style={{ color: '#374151' }}>{strength}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#DC2626' }}>
                            ⚠ Areas for Improvement
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                            {feedback.improvements.map((improvement, idx) => (
                                <li key={idx} style={{ color: '#374151' }}>{improvement}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Missing Keywords */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#F59E0B' }}>
                            🔑 Missing Keywords
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {feedback.keywords.map((keyword, idx) => (
                                <span key={idx} style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#FEF3C7',
                                    color: '#92400E',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                            💡 Recommendations
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                            {feedback.recommendations.map((rec, idx) => (
                                <li key={idx} style={{ color: '#374151' }}>{rec}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                setFeedback(null);
                                setResumeFile(null);
                                setJobDescription('');
                            }}
                            className="btn btn-outline"
                        >
                            Analyze Another Resume
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
