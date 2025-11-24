import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/ai';

export default function DashboardHome() {
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [duration, setDuration] = useState('4');

  const [keyTopics, setKeyTopics] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [preparationPlan, setPreparationPlan] = useState([]);

  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [faqExpanded, setFaqExpanded] = useState(false);

  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);

  const companySuggestions = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Nvidia',
    'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 'SAP', 'Uber',
    'Airbnb', 'Spotify', 'Twitter', 'LinkedIn', 'PayPal', 'Stripe', 'Shopify',
    'Atlassian', 'Zoom', 'Slack', 'Dropbox', 'Square', 'Coinbase', 'Robinhood',
    'DoorDash', 'Instacart', 'Lyft', 'Snap', 'Pinterest', 'Reddit', 'Discord',
    'Figma', 'Notion', 'Canva', 'Databricks', 'Snowflake', 'MongoDB', 'Twilio',
    'ServiceNow', 'Workday', 'Splunk', 'VMware', 'Red Hat', 'Palantir',
    'Cloudflare', 'Datadog', 'HashiCorp', 'GitLab', 'GitHub', 'Elastic',
    'Confluent', 'Unity', 'Epic Games', 'Roblox', 'EA', 'Activision Blizzard',
    'Autodesk', 'Intuit', 'DocuSign', 'HubSpot', 'Zendesk', 'Freshworks',
    'Zscaler', 'CrowdStrike', 'Okta', 'Palo Alto Networks', 'Fortinet',
    'Dell', 'HP', 'Lenovo', 'Samsung', 'Sony', 'LG', 'Qualcomm', 'AMD',
    'ARM', 'TSMC', 'ASML', 'Broadcom', 'Texas Instruments', 'Analog Devices',
    'Accenture', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Capgemini', 'Infosys',
    'TCS', 'Wipro', 'Cognizant', 'HCL', 'Tech Mahindra', 'LTI', 'Mindtree'
  ].sort();

  const roleSuggestions = [
    'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
    'Principal Software Engineer', 'Software Architect', 'Frontend Developer',
    'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'iOS Developer',
    'Android Developer', 'React Developer', 'Angular Developer', 'Vue Developer',
    'Node.js Developer', 'Python Developer', 'Java Developer', 'C++ Developer',
    'Go Developer', 'Rust Developer', 'DevOps Engineer', 'Site Reliability Engineer',
    'Cloud Engineer', 'Cloud Architect', 'Solutions Architect', 'Security Engineer',
    'Cybersecurity Analyst', 'Penetration Tester', 'Data Scientist', 'Data Analyst',
    'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'ML Ops Engineer',
    'Research Scientist', 'Applied Scientist', 'Product Manager', 'Technical Product Manager',
    'Program Manager', 'Engineering Manager', 'Director of Engineering', 'VP of Engineering',
    'CTO', 'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer',
    'Graphic Designer', 'Motion Designer', 'QA Engineer', 'Test Engineer',
    'Automation Engineer', 'Performance Engineer', 'Database Administrator', 'DBA',
    'Systems Engineer', 'Network Engineer', 'Infrastructure Engineer', 'Platform Engineer',
    'Blockchain Developer', 'Smart Contract Developer', 'Game Developer', 'Unity Developer',
    'Unreal Developer', 'AR/VR Developer', 'Embedded Systems Engineer', 'Firmware Engineer',
    'Hardware Engineer', 'ASIC Engineer', 'FPGA Engineer', 'Technical Writer',
    'Developer Advocate', 'Solutions Engineer', 'Sales Engineer', 'Support Engineer',
    'Customer Success Engineer', 'Implementation Engineer', 'Integration Engineer',
    'Business Analyst', 'Systems Analyst', 'Scrum Master', 'Agile Coach', 'Release Manager'
  ].sort();

  const filteredCompanies = targetCompany
    ? companySuggestions.filter(c => c.toLowerCase().includes(targetCompany.toLowerCase()))
    : companySuggestions;

  const filteredRoles = targetRole
    ? roleSuggestions.filter(r => r.toLowerCase().includes(targetRole.toLowerCase()))
    : roleSuggestions;

  const handleUpdateDashboard = async () => {
    if (!targetCompany || !targetRole) {
      alert('Please enter both target company and role');
      return;
    }

    // Save to localStorage for other pages to access
    localStorage.setItem('targetRole', targetRole);
    localStorage.setItem('targetCompany', targetCompany);

    setLoadingTopics(true);
    try {
      const topicsPrompt = `You are a career preparation assistant. A user wants to prepare for a ${targetRole} role at ${targetCompany}. 
      
Please provide:
1. A list of 5-7 key topics they should focus on to crack this role (just the topic names, one per line)
2. Company information including CEO name, established date, headquarters location, and 2-3 recent investments or key advancements

Format your response EXACTLY like this:
TOPICS:
- Topic 1
- Topic 2
- Topic 3

COMPANY:
CEO: [Name]
Established: [Year]
Headquarters: [City, Country]
Recent Investments:
- Investment 1
- Investment 2`;

      const response = await generateAIResponse(topicsPrompt);

      const topicsMatch = response.match(/TOPICS:([\s\S]*?)COMPANY:/);
      const companyMatch = response.match(/COMPANY:([\s\S]*)/);

      if (topicsMatch) {
        const topics = topicsMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().substring(2));
        setKeyTopics(topics);
      }

      if (companyMatch) {
        const companyText = companyMatch[1].trim();
        const ceoMatch = companyText.match(/CEO:\s*(.+)/);
        const estMatch = companyText.match(/Established:\s*(.+)/);
        const hqMatch = companyText.match(/Headquarters:\s*(.+)/);
        const invMatch = companyText.match(/Recent Investments:([\s\S]*)/);

        const investments = invMatch
          ? invMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2))
          : [];

        setCompanyInfo({
          ceo: ceoMatch ? ceoMatch[1].trim() : 'N/A',
          established: estMatch ? estMatch[1].trim() : 'N/A',
          headquarters: hqMatch ? hqMatch[1].trim() : 'N/A',
          investments
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to fetch data. Please try again.');
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!targetCompany || !targetRole || !duration) {
      alert('Please set your target and duration first');
      return;
    }

    if (keyTopics.length === 0) {
      alert('Please click "Update Dashboard" first to fetch key topics');
      return;
    }

    setLoadingPlan(true);
    try {
      const planPrompt = `You are a career preparation assistant. Create a ${duration}-week preparation plan for a ${targetRole} role at ${targetCompany}.

Key topics to cover: ${keyTopics.join(', ')}

Create a weekly breakdown with 3-4 specific tasks per week. Format your response EXACTLY like this:

Week 1:
- Task 1
- Task 2
- Task 3

Week 2:
- Task 1
- Task 2
- Task 3

Continue for all ${duration} weeks.`;

      const response = await generateAIResponse(planPrompt);

      const weeks = [];
      const weekMatches = response.matchAll(/Week (\d+):([\s\S]*?)(?=Week \d+:|$)/g);

      for (const match of weekMatches) {
        const weekNum = match[1];
        const tasks = match[2]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().substring(2));

        if (tasks.length > 0) {
          weeks.push({ week: parseInt(weekNum), tasks });
        }
      }

      setPreparationPlan(weeks);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setLoadingPlan(false);
    }
  };

  const faqs = [
    {
      question: 'How does the AI generate a preparation plan?',
      answer: 'Our AI analyzes your target role and company, then creates a personalized study plan based on common interview patterns, required skills, and industry trends.'
    },
    {
      question: 'Is my resume data stored securely?',
      answer: 'Yes, all your data is encrypted and stored securely. We follow industry-standard security practices and never share your personal information with third parties.'
    },
    {
      question: 'How accurate is the code evaluation?',
      answer: 'Our AI-powered code evaluation checks for correctness, efficiency, and best practices. While highly accurate, we recommend using it as a learning tool alongside manual review.'
    },
    {
      question: 'Can I use my own coding problems in the Practice Arena?',
      answer: 'Currently, the Practice Arena features curated coding problems. We\'re working on adding custom problem support in future updates.'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Welcome back, Edward!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Set your target role and company below to get started.</p>
      </div>

      <div style={{
        backgroundColor: '#E8F4FD',
        borderRadius: '1rem',
        padding: '1.25rem',
        marginBottom: '2.5rem',
        border: '1px solid #B8DAFF'
      }}>
        <strong style={{ color: '#004085' }}>AI-Powered Guidance</strong>
        <p style={{ marginTop: '0.5rem', lineHeight: '1.6', color: '#004085', fontSize: '0.95rem' }}>
          placely.ai leverages generative AI to provide personalized career preparation. While we strive for accuracy, please note that all content is AI-generated and may occasionally contain minor inaccuracies. Users are advised to cross-check critical information for reliability.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.75rem', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Your Target</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Set your goal to personalize your dashboard.</p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <label className="input-label">Target Company</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Google"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  onFocus={() => setShowCompanySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 200)}
                />
                {showCompanySuggestions && filteredCompanies.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    marginTop: '0.5rem',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}>
                    {filteredCompanies.map((company, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setTargetCompany(company);
                          setShowCompanySuggestions(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                          borderBottom: idx < filteredCompanies.length - 1 ? '1px solid #f5f5f5' : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {company}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <label className="input-label">Target Role</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Software Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  onFocus={() => setShowRoleSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
                />
                {showRoleSuggestions && filteredRoles.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    marginTop: '0.5rem',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}>
                    {filteredRoles.map((role, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setTargetRole(role);
                          setShowRoleSuggestions(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                          borderBottom: idx < filteredRoles.length - 1 ? '1px solid #f5f5f5' : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpdateDashboard}
              className="btn btn-primary"
              disabled={loadingTopics}
              style={{ opacity: loadingTopics ? 0.6 : 1, width: '100%' }}
            >
              {loadingTopics ? (
                <>
                  <Loader2 size={18} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                  Loading...
                </>
              ) : 'Update Dashboard'}
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.75rem', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Generate Prep Plan</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Create a weekly study guide based on your key topics.</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Duration (in weeks)</label>
              <input
                type="number"
                className="input-field"
                placeholder="4"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="12"
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              className="btn btn-primary"
              disabled={loadingPlan || keyTopics.length === 0}
              style={{ opacity: (loadingPlan || keyTopics.length === 0) ? 0.6 : 1, width: '100%' }}
            >
              {loadingPlan ? (
                <>
                  <Loader2 size={18} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : 'Generate Plan'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.25rem' }}>Key Topics to Cover</h2>
            {loadingTopics ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <Loader2 size={32} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
                <p>Fetching topics...</p>
              </div>
            ) : keyTopics.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-color)', lineHeight: '2' }}>
                {keyTopics.map((topic, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{topic}</li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Topics Available</p>
                <p style={{ fontSize: '0.9rem' }}>Set a target and click "Update Dashboard" to fetch insights.</p>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.25rem' }}>Company Snapshot</h2>
            {loadingTopics ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <Loader2 size={32} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
                <p>Fetching company info...</p>
              </div>
            ) : companyInfo ? (
              <div style={{ color: 'var(--text-color)', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '0.75rem' }}><strong>CEO:</strong> {companyInfo.ceo}</p>
                <p style={{ marginBottom: '0.75rem' }}><strong>Established:</strong> {companyInfo.established}</p>
                <p style={{ marginBottom: '0.75rem' }}><strong>Headquarters:</strong> {companyInfo.headquarters}</p>
                <p style={{ marginBottom: '0.5rem' }}><strong>Recent Investments:</strong></p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {companyInfo.investments.map((inv, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{inv}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Company Info</p>
                <p style={{ fontSize: '0.9rem' }}>Set a target and click "Update Dashboard" to fetch insights.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Your AI Preparation Plan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>A weekly breakdown of topics and tasks to get you ready.</p>

          {loadingPlan ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <Loader2 size={40} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
              <p>Generating your personalized plan...</p>
            </div>
          ) : preparationPlan.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {preparationPlan.map((weekData) => (
                <div key={weekData.week} style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--background)',
                  borderRadius: '1rem',
                  border: '1px solid #f0f0f0'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Week {weekData.week}</h3>
                  <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-color)', lineHeight: '1.8' }}>
                    {weekData.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)', backgroundColor: 'var(--background)', borderRadius: '1rem' }}>
              <p style={{ fontSize: '1rem' }}>Your generated plan will appear here once you click "Generate Plan".</p>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <button
            onClick={() => setFaqExpanded(!faqExpanded)}
            style={{
              width: '100%',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--surface)',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Find answers to common questions about placely.ai.</p>
            </div>
            {faqExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {faqExpanded && (
            <div className="fade-in" style={{ padding: '0 2rem 2rem 2rem' }}>
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {faqs.map((faq, idx) => (
                  <div key={idx} style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: openFaqIndex === idx ? 'var(--background)' : 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{faq.question}</span>
                      {openFaqIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="fade-in" style={{
                        padding: '1rem 1.25rem',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        fontSize: '0.9rem'
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '0.75rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Can't find the answer you're looking for?</p>
                <button className="btn btn-primary">Contact Support</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
