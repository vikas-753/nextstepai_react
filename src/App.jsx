import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  Palette, Compass, Pencil, Brain, Route, Check, GraduationCap, ShieldAlert,
  DollarSign, Briefcase, Trash2, Landmark, Lightbulb, User, Settings, BarChart2,
  Lock, Key, FileText, ArrowRight, ArrowLeft, LogOut, LayoutDashboard, Plus, Printer, RotateCcw
} from 'lucide-react';

// --- INITIAL SEED DATA ---
const DEFAULT_QUESTIONS = [
  { id: 1, category: 'Education', question: 'What is your current highest education level?', type: 'mcq', options: ['10th Grade / Secondary School', '12th Grade / High School', 'Undergraduate Student', 'Postgraduate Student'], active: true },
  { id: 2, category: 'Education', question: 'What was your academic stream/focus in school?', type: 'mcq', options: ['Science (Maths/Physics/Chemistry)', 'Science (Biology/Chemistry)', 'Commerce (Finance/Accounts)', 'Arts & Humanities', 'General / Other'], active: true },
  { id: 3, category: 'Favorite Subjects', question: 'Which subjects did you enjoy the most?', type: 'multiselect', options: ['Mathematics', 'Physics/Chemistry', 'Biology/Medicine', 'Computer Science & Coding', 'Literature & Languages', 'History & Social Studies', 'Art & Design', 'Business & Economics'], active: true },
  { id: 4, category: 'Interests', question: 'How do you prefer to spend your free time?', type: 'multiselect', options: ['Building or coding things', 'Reading, writing or blogging', 'Drawing, playing music or designing', 'Gaming or solving logic puzzles', 'Public speaking or debating', 'Volunteering & helping people', 'Sports, outdoor activities or traveling'], active: true },
  { id: 5, category: 'Skill Ratings', question: 'Rate your Coding & Logical Problem Solving skills:', type: 'rating', options: [], active: true },
  { id: 6, category: 'Skill Ratings', question: 'Rate your Creative Design & Artistic skills:', type: 'rating', options: [], active: true },
  { id: 7, category: 'Skill Ratings', question: 'Rate your Verbal & Written Communication skills:', type: 'rating', options: [], active: true },
  { id: 8, category: 'Personality', question: 'How would you describe your working style?', type: 'mcq', options: ['I love leading teams and speaking to groups.', 'I work best independently on structured tasks.', 'I enjoy collaborative brain-storming sessions.', 'I prefer hands-on creative experiments.'], active: true },
  { id: 9, category: 'Situational Questions', question: 'If an app you are using crashes, what is your first instinct?', type: 'mcq', options: ['Google why it crashed and try to fix it.', 'Wait for an update or complain to support.', 'Look at its visual design and think of a better layout.', 'Delete it and look for an alternative.'], active: true },
  { id: 10, category: 'Career Preferences', question: 'What type of work environment excites you most?', type: 'mcq', options: ['High-growth Tech Startup', 'Structured Corporate Office', 'Creative Studio / Agency', 'Social NGO or Public Service', 'Research Lab or University', 'My own business / Freelancing'], active: true },
  { id: 11, category: 'Salary Expectations', question: 'What are your primary motivators for your future career?', type: 'multiselect', options: ['High earning potential & financial security', 'Creative freedom & expressing myself', 'Making a social impact & helping society', 'Constant learning & intellectual challenges', 'Flexible hours & work-life balance'], active: true },
  { id: 12, category: 'Study Commitment', question: 'How many years are you willing to invest in higher education/training?', type: 'mcq', options: ['1-2 years (Short-term certifications/diplomas)', '3-4 years (Bachelor\'s degree)', '5+ years (Master\'s, Ph.D. or Medical training)', 'None, I want to start working immediately'], active: true },
  { id: 13, category: 'Family Support', question: 'Does your family have specific expectations or supports for your education?', type: 'mcq', options: ['Fully supportive of any career path I choose', 'Prefer traditional fields like Engineering, Medicine, or Law', 'Encourage entrepreneurship / Family business', 'Financial constraints require early job placement'], active: true },
  { id: 14, category: 'Dream & Goals', question: 'Briefly describe your dream career and what you want to build or achieve:', type: 'text', options: [], active: true }
];

const DEFAULT_CAREERS = [
  { id: 1, career: 'Software Developer', description: 'Designs, codes, and tests software applications, operating systems, or mobile utility tools.', degree: 'B.Sc. in Computer Science or Software Engineering', skills: 'PHP, Python, JavaScript, Git, SQL, Problem Solving', salary: '$75,000 - $120,000', growth_rate: '25% (High Growth)' },
  { id: 2, career: 'UI/UX Designer', description: 'Researches, prototypes, and designs user interfaces and digital experiences for software products.', degree: 'Bachelor of Design, B.Sc. in Human-Computer Interaction', skills: 'Figma, User Research, Wireframing, Creative Design, HTML/CSS', salary: '$70,000 - $110,000', growth_rate: '18% (Medium Growth)' },
  { id: 3, career: 'Product Manager', description: 'Directs product development cycles from planning, engineering to delivery and marketing strategies.', degree: 'B.Sc. in Business Administration or Technical equivalent', skills: 'Agile, Product Roadmap, Communication, Data Analytics', salary: '$85,000 - $130,000', growth_rate: '20% (High Growth)' },
  { id: 4, career: 'Data Scientist', description: 'Collects, analyzes, and models large datasets to discover key business intelligence metrics.', degree: 'M.Sc. in Statistics, Data Science, or Mathematics', skills: 'Python, SQL, Machine Learning, Tableau, Statistics', salary: '$90,000 - $140,000', growth_rate: '35% (Extremely High Growth)' },
  { id: 5, career: 'Digital Marketing Strategist', description: 'Plans and executes SEO, advertising, and content strategies to promote digital brand identity.', degree: 'B.A. in Communications, Marketing, or Business', skills: 'SEO, Content Writing, Google Analytics, Copywriting', salary: '$55,000 - $85,000', growth_rate: '10% (Steady Growth)' }
];

const DEFAULT_PROMPT = "You are CareerMap AI, a professional career guidance counselor. Analyze the student's profile, questionnaire details, skills, and goals. Recommend 3 suitable career matches. Explain why each fits, degrees, certifications, future-ready skills, salary estimates, business ideas, government options, and a structured 1, 3, and 5-year roadmap. Return ONLY a valid JSON object matching the requested schema. Do not output markdown code blocks or wrapper text outside the JSON.";

export default function App() {
  // --- STATE ---
  const [view, setView] = useState('landing'); // landing, login, register, wizard, dashboard, admin
  const [session, setSession] = useState(null); // current logged-in user
  const [questions, setQuestions] = useState([]);
  const [careers, setCareers] = useState([]);
  const [settings, setSettings] = useState({ openai_api_key: '', system_prompt: DEFAULT_PROMPT });
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Auth Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [profileData, setProfileData] = useState({
    age: '', gender: '', city: '', state: '', country: '', percentage: '', failed_subject: 'None', goal: ''
  });
  const [answers, setAnswers] = useState({}); // questionId -> answer text or array
  const [wizardLoading, setWizardLoading] = useState(false);

  // Admin Tab State
  const [adminTab, setAdminTab] = useState('overview'); // overview, questions, careers, settings
  const [newQuestion, setNewQuestion] = useState({ category: 'Education', question: '', type: 'mcq', options: '' });
  const [newCareer, setNewCareer] = useState({ career: '', description: '', degree: '', skills: '', salary: '', growth_rate: '' });
  const [adminApiKey, setAdminApiKey] = useState('');
  const [adminSystemPrompt, setAdminSystemPrompt] = useState('');

  // Chart Reference
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load database collections from localstorage
    const localQuestions = localStorage.getItem('careermap_questions');
    if (localQuestions) setQuestions(JSON.parse(localQuestions));
    else {
      localStorage.setItem('careermap_questions', JSON.stringify(DEFAULT_QUESTIONS));
      setQuestions(DEFAULT_QUESTIONS);
    }

    const localCareers = localStorage.getItem('careermap_careers');
    if (localCareers) setCareers(JSON.parse(localCareers));
    else {
      localStorage.setItem('careermap_careers', JSON.stringify(DEFAULT_CAREERS));
      setCareers(DEFAULT_CAREERS);
    }

    const localSettings = localStorage.getItem('careermap_settings');
    if (localSettings) {
      const parsed = JSON.parse(localSettings);
      setSettings(parsed);
      setAdminApiKey(parsed.openai_api_key || '');
      setAdminSystemPrompt(parsed.system_prompt || DEFAULT_PROMPT);
    } else {
      const initial = { openai_api_key: '', system_prompt: DEFAULT_PROMPT };
      localStorage.setItem('careermap_settings', JSON.stringify(initial));
      setSettings(initial);
      setAdminSystemPrompt(DEFAULT_PROMPT);
    }

    const localUsers = localStorage.getItem('careermap_users');
    if (localUsers) setUsers(JSON.parse(localUsers));
    else localStorage.setItem('careermap_users', JSON.stringify([]));

    const localReports = localStorage.getItem('careermap_reports');
    if (localReports) setReports(JSON.parse(localReports));
    else localStorage.setItem('careermap_reports', JSON.stringify([]));

    const localSession = localStorage.getItem('careermap_session');
    if (localSession) {
      const parsed = JSON.parse(localSession);
      setSession(parsed);
      // Automatically load dashboard if report exists
      const reportsList = JSON.parse(localStorage.getItem('careermap_reports') || '[]');
      const userReport = reportsList.find(r => r.user_id === parsed.id);
      if (userReport) setView('dashboard');
    }
  }, []);

  // --- CHART COMPILING ---
  useEffect(() => {
    if (view === 'dashboard' && chartRef.current && session) {
      const userReport = reports.find(r => r.user_id === session.id);
      if (userReport) {
        const reportData = userReport.ai_json;
        // Derive some compatibility metrics
        let tech = 60, creative = 60, comm = 60, biz = 60, social = 60;
        
        if (reportData.top_career_matches) {
          reportData.top_career_matches.forEach(m => {
            const c = m.career.toLowerCase();
            if (c.includes('software') || c.includes('engineer') || c.includes('tech') || c.includes('data') || c.includes('cyber')) {
              tech += 10;
              comm += 3;
            }
            if (c.includes('design') || c.includes('creative') || c.includes('art') || c.includes('media')) {
              creative += 10;
              tech += 3;
            }
            if (c.includes('manager') || c.includes('business') || c.includes('product') || c.includes('consult')) {
              biz += 10;
              comm += 5;
            }
            if (c.includes('resource') || c.includes('counselor') || c.includes('coach') || c.includes('relation') || c.includes('specialist')) {
              social += 10;
              comm += 6;
            }
          });
        }

        const ctx = chartRef.current.getContext('2d');
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Tech & Logic', 'Creativity & Art', 'Communication', 'Business & Mgmt', 'Social & Helping'],
            datasets: [{
              label: 'Compatibility Profile',
              data: [tech, creative, comm, biz, social],
              backgroundColor: 'rgba(79, 93, 149, 0.15)',
              borderColor: '#2c2e35',
              borderWidth: 2,
              pointBackgroundColor: '#e28774',
              pointBorderColor: '#2c2e35',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
          },
          options: {
            scales: {
              r: {
                angleLines: { color: '#2c2e35' },
                grid: { color: 'rgba(0,0,0,0.08)' },
                pointLabels: {
                  font: { family: 'Outfit', size: 11, weight: 'bold' },
                  color: '#2c2e35'
                },
                ticks: { display: false, stepSize: 20 },
                suggestedMin: 30,
                suggestedMax: 100
              }
            },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [view, reports, session]);

  // --- ACTIONS ---

  // Register
  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authName || !authEmail || !authPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    const currentUsers = JSON.parse(localStorage.getItem('careermap_users') || '[]');
    if (currentUsers.find(u => u.email === authEmail)) {
      setAuthError('An account with this email already exists.');
      return;
    }

    // Role assignment (First user is admin, rest are students)
    const role = currentUsers.length === 0 ? 'admin' : 'student';
    const newUser = {
      id: Date.now(),
      name: authName,
      email: authEmail,
      password: authPassword, // In a client demo, store clear-text or simple hashed passwords
      role: role,
      created_at: new Date().toISOString()
    };

    const updated = [...currentUsers, newUser];
    localStorage.setItem('careermap_users', JSON.stringify(updated));
    setUsers(updated);

    // Save session
    localStorage.setItem('careermap_session', JSON.stringify(newUser));
    setSession(newUser);
    setView('wizard');

    // Reset Form
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const currentUsers = JSON.parse(localStorage.getItem('careermap_users') || '[]');
    const match = currentUsers.find(u => u.email === authEmail && u.password === authPassword);
    if (!match) {
      setAuthError('Invalid email or password.');
      return;
    }

    localStorage.setItem('careermap_session', JSON.stringify(match));
    setSession(match);

    // Check if report exists
    const reportsList = JSON.parse(localStorage.getItem('careermap_reports') || '[]');
    const userReport = reportsList.find(r => r.user_id === match.id);
    if (userReport) setView('dashboard');
    else setView('wizard');

    setAuthEmail('');
    setAuthPassword('');
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('careermap_session');
    setSession(null);
    setView('landing');
    setWizardStep(1);
    setAnswers({});
    setProfileData({
      age: '', gender: '', city: '', state: '', country: '', percentage: '', failed_subject: 'None', goal: ''
    });
  };

  // Wizard Option highlights
  const toggleOption = (qId, option, isMulti) => {
    if (isMulti) {
      const current = answers[qId] || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [qId]: current.filter(o => o !== option) });
      } else {
        setAnswers({ ...answers, [qId]: [...current, option] });
      }
    } else {
      setAnswers({ ...answers, [qId]: option });
    }
  };

  // Wizard Submit & AI Compiler
  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.age || !profileData.goal) {
      alert("Please answer all required questions.");
      return;
    }

    setWizardLoading(true);

    // Prompt payload details
    const textAnswers = Object.entries(answers).map(([qId, val]) => {
      const q = questions.find(qst => qst.id === parseInt(qId));
      const textVal = Array.isArray(val) ? val.join(', ') : val;
      return `${q ? q.question : qId}: ${textVal}`;
    });

    const userPrompt = `Student age: ${profileData.age}. Gender: ${profileData.gender}. Location: ${profileData.city}, ${profileData.state}, ${profileData.country}. Grades: ${profileData.percentage}. Struggling: ${profileData.failed_subject}. Goal: ${profileData.goal}.\nQuestion answers:\n${textAnswers.join('\n')}`;

    let reportJson = null;

    if (settings.openai_api_key) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openai_api_key}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: settings.system_prompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
          })
        });
        const data = await response.json();
        if (data.choices && data.choices[0].message.content) {
          reportJson = JSON.parse(data.choices[0].message.content);
        }
      } catch (err) {
        console.error("OpenAI request failed, triggering client mock framework:", err);
      }
    }

    // Fallback Mock generator if OpenAI returns empty or fails
    if (!reportJson) {
      reportJson = compileClientMockReport(profileData, answers);
    }

    // Save report
    const newReport = {
      id: Date.now(),
      user_id: session.id,
      ai_json: reportJson,
      created_at: new Date().toISOString()
    };

    const currentReports = JSON.parse(localStorage.getItem('careermap_reports') || '[]');
    const filtered = currentReports.filter(r => r.user_id !== session.id); // clear older
    const updated = [...filtered, newReport];
    localStorage.setItem('careermap_reports', JSON.stringify(updated));
    setReports(updated);

    setWizardLoading(false);
    setView('dashboard');
  };

  // --- CLIENT-SIDE MOCK COMPILER ---
  const compileClientMockReport = (profile, qAnswers) => {
    let techInterest = false;
    let creativeInterest = false;
    let humanitiesInterest = false;

    Object.values(qAnswers).forEach(val => {
      const strVal = Array.isArray(val) ? val.join(' ') : String(val);
      const low = strVal.toLowerCase();
      if (low.includes('code') || low.includes('computer') || low.includes('math')) techInterest = true;
      if (low.includes('drawing') || low.includes('design') || low.includes('art')) creativeInterest = true;
      if (low.includes('helping') || low.includes('volunteer') || low.includes('public')) humanitiesInterest = true;
    });

    let career1 = 'Full-Stack Developer';
    let career1_fit = 'Your interests in building and coding align perfectly with designing complex software, database integrations, and application servers.';
    let career2 = 'UI/UX Designer';
    let career2_fit = 'You enjoy designing things but also appreciate coding, allowing you to bridge the gap between design mockups and frontend code.';
    let career3 = 'Product Manager';
    let career3_fit = 'Your ability to communicate combined with analytical and creative capabilities lets you lead cross-functional product development.';

    if (creativeInterest && !techInterest) {
      career1 = 'Brand Identity Designer';
      career1_fit = 'Your strong creative design preferences make you ideal for defining company logos, visual styles, and user interfaces.';
      career2 = 'Digital Content Strategist';
      career2_fit = 'You excel at communicating and blogging, which allows you to design and orchestrate engaging digital media campaigns.';
      career3 = 'Creative Art Director';
      career3_fit = 'Your capability to lead creative experiments makes you fit for directing advertising, layout, and film concepts.';
    } else if (humanitiesInterest && !techInterest) {
      career1 = 'Human Resources Specialist';
      career1_fit = 'Your passion for helping others and public speaking makes you a natural candidate for hiring, training, and building company cultures.';
      career2 = 'Clinical Counselor';
      career2_fit = 'You enjoy volunteering and working with people directly to solve personal or academic hurdles.';
      career3 = 'Public Relations Manager';
      career3_fit = 'Your excellent communication skills are highly valued for managing company communications and public relations.';
    }

    return {
      student_summary: `Student demonstrates strong alignment toward self-driven development and structural creation in project execution. Goal: "${profile.goal}".`,
      personality_profile: 'Combines strong logical processing with structured, visual problem-solving. Prefers project-based tasks with tangible outcomes.',
      strengths: ['Logical reasoning', 'Analytical design', 'Independent learning'],
      weaknesses: ['Public speaking presentation anxiety', 'Impatience with legacy frameworks'],
      learning_style: 'Visual & Hands-On (Constructing prototypes, exploring interactive flow diagrams).',
      top_career_matches: [
        {
          career: career1,
          compatibility_score: 95,
          why_fit: career1_fit,
          recommended_degrees: ['B.Sc. in Computer Science', 'B.Tech in Information Technology'],
          alternative_degrees: ['Vite & React Development Bootcamp Certification'],
          skills_to_learn: ['React, Node.js, Git', 'JSON response styling', 'Database integration'],
          certifications: ['AWS Developer Associate', 'Google UX Certificate'],
          salary_estimates: { Entry: '$75k - $90k', Mid: '$105k - $125k', Senior: '$145k - $185k' },
          business_ideas: ['Start a freelance web engineering hub', 'Build Shopify custom widgets'],
          government_opportunities: ['System designer for federal departments', 'IT coordinator for civil services'],
          roadmap: {
            year_1: 'Master foundational programming and React component design. Build clean visual state layouts.',
            year_3: 'Gain experience in backend systems, work with frameworks, and implement multi-step form routers.',
            year_5: 'Transition to principal software lead architect. Manage team deliveries and draft scale roadmaps.'
          }
        },
        {
          career: career2,
          compatibility_score: 88,
          why_fit: career2_fit,
          recommended_degrees: ['Bachelor of Design (B.Des)', 'B.Sc in Human-Computer Interaction'],
          alternative_degrees: ['UX Research Certifications'],
          skills_to_learn: ['Figma wireframing', 'Color theory & Canvas typography', 'User testing'],
          certifications: ['Interaction Design Foundation Certification', 'Google UX Certificate'],
          salary_estimates: { Entry: '$65k - $80k', Mid: '$90k - $110k', Senior: '$130k - $160k' },
          business_ideas: ['Establish a custom branding studio', 'Offer remote UX auditing services'],
          government_opportunities: ['UX Consultant for municipal applications', 'Media strategist for public information boards'],
          roadmap: {
            year_1: 'Master design tools like Figma, draft wireframes, and understand color grids and canvas patterns.',
            year_3: 'Work in cross-functional squads, design production-ready wireframes, and run user research surveys.',
            year_5: 'Scale to director of product experience or launch a branding agency.'
          }
        },
        {
          career: career3,
          compatibility_score: 82,
          why_fit: career3_fit,
          recommended_degrees: ['B.Sc in Business Administration', 'B.Sc in Computer Science'],
          alternative_degrees: ['Scrum Product Owner License'],
          skills_to_learn: ['Agile execution', 'Strategic roadmap design', 'Market analysis'],
          certifications: ['Certified Scrum Product Owner (CSPO)', 'Project Management Professional (PMP)'],
          salary_estimates: { Entry: '$80k - $95k', Mid: '$110k - $130k', Senior: '$150k - $185k' },
          business_ideas: ['Launch a product strategy consultancy', 'Develop software integration plugins'],
          government_opportunities: ['Public program delivery lead', 'Operations coordinator for utility networks'],
          roadmap: {
            year_1: 'Shadow senior managers, learn agile routines, and coordinate backlog sprint assemblies.',
            year_3: 'Own a complete feature module lifecycle, compile research matrices, and coordinate releases.',
            year_5: 'Lead multi-product portfolios or spin up an enterprise application.'
          }
        }
      ],
      encouragement: 'Your unique combination of skills is highly valuable. Keep building, stay curious, and sketch the path you want to tread.'
    };
  };

  // --- ADMIN ACTIONS ---
  
  // Add Question
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question) return;
    const optionsArr = newQuestion.options.split('\n').map(o => o.trim()).filter(Boolean);
    const q = {
      id: Date.now(),
      category: newQuestion.category,
      question: newQuestion.question,
      type: newQuestion.type,
      options: optionsArr,
      active: true
    };
    const updated = [...questions, q];
    setQuestions(updated);
    localStorage.setItem('careermap_questions', JSON.stringify(updated));
    setNewQuestion({ category: 'Education', question: '', type: 'mcq', options: '' });
  };

  // Delete Question
  const handleDeleteQuestion = (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem('careermap_questions', JSON.stringify(updated));
  };

  // Add Career
  const handleAddCareer = (e) => {
    e.preventDefault();
    if (!newCareer.career) return;
    const c = {
      id: Date.now(),
      ...newCareer
    };
    const updated = [...careers, c];
    setCareers(updated);
    localStorage.setItem('careermap_careers', JSON.stringify(updated));
    setNewCareer({ career: '', description: '', degree: '', skills: '', salary: '', growth_rate: '' });
  };

  // Delete Career
  const handleDeleteCareer = (id) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    const updated = careers.filter(c => c.id !== id);
    setCareers(updated);
    localStorage.setItem('careermap_careers', JSON.stringify(updated));
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updated = { openai_api_key: adminApiKey, system_prompt: adminSystemPrompt };
    setSettings(updated);
    localStorage.setItem('careermap_settings', JSON.stringify(updated));
    alert('Settings saved successfully!');
  };

  // --- VIEW RENDERING HELPERS ---
  const currentReport = session ? reports.find(r => r.user_id === session.id) : null;
  const reportData = currentReport ? currentReport.ai_json : null;

  return (
    <div>
      {/* Navbar Navigation */}
      <nav className="navbar navbar-expand-lg navbar-sketch mb-4 no-print">
        <div className="container">
          <div className="navbar-brand-sketch" onClick={() => setView('landing')}>
            <Compass className="me-2 fa-spin" style={{ animationDuration: '15s' }} size={28} />
            CareerMap<span>AI</span>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{ border: '2px solid var(--pencil-color)' }}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <div className="nav-link nav-link-sketch" onClick={() => setView('landing')}>Home</div>
              </li>
              {session ? (
                <>
                  <li className="nav-item">
                    <div className="nav-link nav-link-sketch" onClick={() => setView('wizard')}>My Profile</div>
                  </li>
                  {reportData && (
                    <li className="nav-item">
                      <div className="nav-link nav-link-sketch" onClick={() => setView('dashboard')}>Dashboard</div>
                    </li>
                  )}
                  {session.role === 'admin' && (
                    <li className="nav-item">
                      <div className="nav-link nav-link-sketch" onClick={() => setView('admin')}>Admin Panel</div>
                    </li>
                  )}
                  <li className="nav-item ms-2">
                    <span className="navbar-text me-2 d-none d-lg-inline-block handwritten text-muted" style={{ fontSize: '1.2rem' }}>
                      Hello, {session.name}!
                    </span>
                  </li>
                  <li className="nav-item">
                    <div className="btn-sketch btn-sm" onClick={handleLogout}><LogOut size={16} className="me-1" /> Logout</div>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <div className="nav-link nav-link-sketch" onClick={() => setView('login')}>Login</div>
                  </li>
                  <li className="nav-item">
                    <div className="btn-sketch-primary" onClick={() => setView('register')}>Sign Up</div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        
        {/* --- LANDING VIEW --- */}
        {view === 'landing' && (
          <div>
            <div className="row align-items-center my-5">
              <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 watercolor-bg-blue">
                <h1 className="display-3 fw-bold mb-3">
                  Sketch Your <span className="highlight-coral text-dark">Dream Career</span> with AI guidance
                </h1>
                <p className="lead text-muted fs-4 mb-4">
                  We act as your digital career counselor. Take an interactive, artistic questionnaire to discover career paths tailored to your personality, interests, and skills.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                  {session ? (
                    <>
                      <div onClick={() => setView('wizard')} className="btn-sketch-primary btn-lg">
                        <Pencil size={18} className="me-2" /> Start Career Profiler
                      </div>
                      {reportData && (
                        <div onClick={() => setView('dashboard')} className="btn-sketch btn-lg">
                          <BarChart2 size={18} className="me-2" /> View Dashboard
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div onClick={() => setView('register')} className="btn-sketch-primary btn-lg">
                        <Plus size={18} className="me-2" /> Sign Up For Free
                      </div>
                      <div onClick={() => setView('login')} className="btn-sketch btn-lg">
                        <Lock size={18} className="me-2" /> Login
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-6 text-center position-relative">
                <div className="sketch-card p-2 mx-auto" style={{ maxWidth: '500px', transform: 'rotate(1deg)' }}>
                  <img src="/src/assets/careermap_ui_mockup_1784202226695.jpg" alt="CareerMap AI Mockup" className="img-fluid rounded" style={{ borderRadius: '20px' }} onError={(e) => {
                    e.target.style.display = 'none';
                  }} />
                  <div style={{ minHeight: '280px', background: 'var(--canvas-bg)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} className="p-4 d-only-if-no-img">
                    <Palette size={64} className="text-primary mb-3" />
                    <h3 className="handwritten">CareerMap AI Blueprint</h3>
                    <p className="text-muted text-center">Your custom watercolor profile dashboard awaits.</p>
                  </div>
                  <div className="handwritten text-muted text-center mt-2" style={{ fontSize: '1.3rem' }}>
                    <Check className="text-success me-1" size={16} /> Hand-drawn watercolor design
                  </div>
                </div>
              </div>
            </div>

            <div className="my-5 py-5 text-center">
              <h2 className="title-sketch text-center mb-5">How It Works</h2>
              <div className="row g-4 justify-content-center">
                <div className="col-md-4">
                  <div className="sketch-card h-100 watercolor-bg-blue">
                    <div className="fs-1 text-primary mb-3"><Pencil size={36} /></div>
                    <h3 className="fw-bold">1. Express Yourself</h3>
                    <p className="text-muted">Answer around 15 intuitive, interactive questions covering your favorite subjects, interests, and working styles.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="sketch-card h-100">
                    <div className="fs-1 text-danger mb-3"><Brain size={36} /></div>
                    <h3 className="fw-bold">2. AI Counselor Analysis</h3>
                    <p className="text-muted">Our structured AI algorithm evaluates your strengths, learning styles, and motivators to select 3 matched paths.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="sketch-card h-100 watercolor-bg-coral">
                    <div className="fs-1 text-warning mb-3"><Route size={36} /></div>
                    <h3 className="fw-bold">3. Interactive Roadmaps</h3>
                    <p className="text-muted">Get detailed matches with certification plans, salary growth graphs, 1/3/5-year roadmaps, and printable reports.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-5 sketch-card text-center py-5 watercolor-bg-coral" style={{ transform: 'rotate(-0.5deg)' }}>
              <h2 className="handwritten mb-4" style={{ fontSize: '2.8rem' }}>Our Guidance Philosophy</h2>
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <p className="fs-5 text-dark mb-4">
                    We believe career guidance shouldn't make final claims about your future. CareerMap AI is designed as a career counselor that outlines practical next steps, explores alternative degrees, and nurtures continuous learning.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <span className="badge bg-light text-dark p-2 border border-dark"><Check className="text-success me-1" size={16} /> Counselor, not Predictor</span>
                    <span className="badge bg-light text-dark p-2 border border-dark"><Check className="text-success me-1" size={16} /> Strengths-focused</span>
                    <span className="badge bg-light text-dark p-2 border border-dark"><Check className="text-success me-1" size={16} /> Clear Roadmap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- REGISTER VIEW --- */}
        {view === 'register' && (
          <div className="row justify-content-center my-5">
            <div className="col-md-6 col-lg-5">
              <div className="sketch-card watercolor-bg-blue">
                <h2 className="text-center mb-4 handwritten" style={{ fontSize: '2.5rem' }}>Join CareerMap AI</h2>
                {authError && <div className="alert alert-danger border-dark"><ShieldAlert size={16} className="me-2" /> {authError}</div>}
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="text" className="form-control form-control-sketch" value={authName} onChange={e => setAuthName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control form-control-sketch" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <input type="password" className="form-control form-control-sketch" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Confirm Password</label>
                    <input type="password" className="form-control form-control-sketch" value={authConfirmPassword} onChange={e => setAuthConfirmPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-sketch-primary w-100 py-3">Register Account</button>
                </form>
                <hr className="my-4 border-dark" />
                <p className="text-center mb-0">
                  Already have an account? <span onClick={() => setView('login')} className="fw-bold text-decoration-none highlight-yellow cursor-pointer">Login Here</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <div className="row justify-content-center my-5">
            <div className="col-md-6 col-lg-5">
              <div className="sketch-card watercolor-bg-coral">
                <h2 className="text-center mb-4 handwritten" style={{ fontSize: '2.5rem' }}>Welcome Back</h2>
                {authError && <div className="alert alert-danger border-dark"><ShieldAlert size={16} className="me-2" /> {authError}</div>}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control form-control-sketch" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <input type="password" className="form-control form-control-sketch" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-sketch-primary w-100 py-3">Login to Account</button>
                </form>
                <hr className="my-4 border-dark" />
                <p className="text-center mb-0">
                  Don't have an account yet? <span onClick={() => setView('register')} className="fw-bold text-decoration-none highlight-yellow cursor-pointer">Register Here</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- WIZARD VIEW --- */}
        {view === 'wizard' && (
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-10">
              <div className="sketch-card watercolor-bg-blue">
                <div className="text-center mb-4">
                  <h1 className="title-sketch text-center">My Career Blueprint</h1>
                  <p className="text-muted">Answer these questions carefully. The AI counselor will use your answers to design your custom roadmap.</p>
                </div>

                <div className="wizard-progress my-4">
                  <div className={`wizard-step ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'completed' : ''}`}>1</div>
                  <div className={`wizard-step ${wizardStep === 2 ? 'active' : wizardStep > 2 ? 'completed' : ''}`}>2</div>
                  <div className={`wizard-step ${wizardStep === 3 ? 'active' : wizardStep > 3 ? 'completed' : ''}`}>3</div>
                  <div className={`wizard-step ${wizardStep === 4 ? 'active' : wizardStep > 4 ? 'completed' : ''}`}>4</div>
                </div>

                {wizardLoading ? (
                  <div className="text-center py-5">
                    <Compass size={64} className="text-primary fa-spin mb-4" style={{ animationDuration: '4s' }} />
                    <h3 className="handwritten">Drafting Your Blueprint...</h3>
                    <p className="text-muted">AI is analyzing your skills, working style, and motivators.</p>
                  </div>
                ) : (
                  <form onSubmit={handleWizardSubmit}>
                    {/* STEP 1 */}
                    {wizardStep === 1 && (
                      <div>
                        <h3 className="handwritten text-primary mb-3" style={{ fontSize: '2.2rem' }}><GraduationCap className="me-2" size={28} /> Step 1: Academic & Basic Profile</h3>
                        <hr className="border-dark mb-4" />
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">How old are you?</label>
                            <input type="number" className="form-control form-control-sketch" value={profileData.age} onChange={e => setProfileData({...profileData, age: e.target.value})} required min="10" max="60" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Gender</label>
                            <select className="form-select form-control-sketch" value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value})} required>
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other / Non-Binary</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">City</label>
                            <input type="text" className="form-control form-control-sketch" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} required />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">State / Province</label>
                            <input type="text" className="form-control form-control-sketch" value={profileData.state} onChange={e => setProfileData({...profileData, state: e.target.value})} required />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Country</label>
                            <input type="text" className="form-control form-control-sketch" value={profileData.country} onChange={e => setProfileData({...profileData, country: e.target.value})} required />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Average Grades / Percentage (%)</label>
                            <input type="text" className="form-control form-control-sketch" value={profileData.percentage} onChange={e => setProfileData({...profileData, percentage: e.target.value})} required />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Any failed or highly struggled subjects?</label>
                            <input type="text" className="form-control form-control-sketch" value={profileData.failed_subject} onChange={e => setProfileData({...profileData, failed_subject: e.target.value})} />
                          </div>
                        </div>

                        {questions.filter(q => q.category === 'Education').map(q => (
                          <div className="mb-4" key={q.id}>
                            <label className="form-label fw-bold">{q.question}</label>
                            <div className="options-container">
                              {q.options.map(opt => (
                                <div key={opt} className={`option-box ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => toggleOption(q.id, opt, false)}>
                                  <input type="radio" checked={answers[q.id] === opt} onChange={() => {}} />
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="d-flex justify-content-end mt-4">
                          <button type="button" className="btn-sketch-primary" onClick={() => setWizardStep(2)}>Next Step <ArrowRight size={16} className="ms-2" /></button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {wizardStep === 2 && (
                      <div>
                        <h3 className="handwritten text-danger mb-3" style={{ fontSize: '2.2rem' }}><Palette className="me-2" size={28} /> Step 2: Interests, Hobbies & Skills</h3>
                        <hr className="border-dark mb-4" />

                        {questions.filter(q => q.category === 'Favorite Subjects' || q.category === 'Interests' || q.category === 'Skill Ratings').map(q => (
                          <div className="mb-4" key={q.id}>
                            <label className="form-label fw-bold d-block">{q.question}</label>
                            {q.type === 'multiselect' ? (
                              <div className="row">
                                {q.options.map(opt => (
                                  <div className="col-md-6" key={opt}>
                                    <div className={`option-box ${(answers[q.id] || []).includes(opt) ? 'selected' : ''}`} onClick={() => toggleOption(q.id, opt, true)}>
                                      <input type="checkbox" checked={(answers[q.id] || []).includes(opt)} onChange={() => {}} />
                                      <span>{opt}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : q.type === 'rating' ? (
                              <div>
                                <div className="d-flex align-items-center gap-3">
                                  <span className="text-muted small">Beginner</span>
                                  <input type="range" min="1" max="5" value={answers[q.id] || 3} onChange={e => setAnswers({ ...answers, [q.id]: parseInt(e.target.value) })} className="slider-sketch flex-grow-1" />
                                  <span className="text-muted small">Expert</span>
                                </div>
                                <div className="text-center mt-1"><span className="badge bg-secondary">{answers[q.id] || 3}</span></div>
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" className="btn-sketch" onClick={() => setWizardStep(1)}><ArrowLeft size={16} className="me-2" /> Back</button>
                          <button type="button" className="btn-sketch-primary" onClick={() => setWizardStep(3)}>Next Step <ArrowRight size={16} className="ms-2" /></button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {wizardStep === 3 && (
                      <div>
                        <h3 className="handwritten text-warning mb-3" style={{ fontSize: '2.2rem' }}><Brain className="me-2" size={28} /> Step 3: Work Style & Scenarios</h3>
                        <hr className="border-dark mb-4" />

                        {questions.filter(q => q.category === 'Personality' || q.category === 'Situational Questions' || q.category === 'Career Preferences' || q.category === 'Salary Expectations').map(q => (
                          <div className="mb-4" key={q.id}>
                            <label className="form-label fw-bold d-block">{q.question}</label>
                            {q.type === 'mcq' ? (
                              <div className="options-container">
                                {q.options.map(opt => (
                                  <div key={opt} className={`option-box ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => toggleOption(q.id, opt, false)}>
                                    <input type="radio" checked={answers[q.id] === opt} onChange={() => {}} />
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            ) : q.type === 'multiselect' ? (
                              <div className="row">
                                {q.options.map(opt => (
                                  <div className="col-md-6" key={opt}>
                                    <div className={`option-box ${(answers[q.id] || []).includes(opt) ? 'selected' : ''}`} onClick={() => toggleOption(q.id, opt, true)}>
                                      <input type="checkbox" checked={(answers[q.id] || []).includes(opt)} onChange={() => {}} />
                                      <span>{opt}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" className="btn-sketch" onClick={() => setWizardStep(2)}><ArrowLeft size={16} className="me-2" /> Back</button>
                          <button type="button" className="btn-sketch-primary" onClick={() => setWizardStep(4)}>Next Step <ArrowRight size={16} className="ms-2" /></button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4 */}
                    {wizardStep === 4 && (
                      <div>
                        <h3 className="handwritten text-success mb-3" style={{ fontSize: '2.2rem' }}><Route className="me-2" size={28} /> Step 4: Study Commitment & Goals</h3>
                        <hr className="border-dark mb-4" />

                        {questions.filter(q => q.category === 'Study Commitment' || q.category === 'Family Support' || q.category === 'Dream & Goals').map(q => (
                          <div className="mb-4" key={q.id}>
                            <label className="form-label fw-bold d-block">{q.question}</label>
                            {q.type === 'mcq' ? (
                              <div className="options-container">
                                {q.options.map(opt => (
                                  <div key={opt} className={`option-box ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => toggleOption(q.id, opt, false)}>
                                    <input type="radio" checked={answers[q.id] === opt} onChange={() => {}} />
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            ) : q.type === 'text' ? (
                              <textarea rows="4" className="form-control form-control-sketch" value={answers[q.id] || ''} onChange={e => setAnswers({...answers, [q.id]: e.target.value})} required placeholder="Describe your dream career..." />
                            ) : null}
                          </div>
                        ))}

                        <div className="mb-4">
                          <label className="form-label fw-bold">Primary immediate goal</label>
                          <input type="text" className="form-control form-control-sketch" value={profileData.goal} onChange={e => setProfileData({...profileData, goal: e.target.value})} required placeholder="e.g. Build an AI software startup" />
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button type="button" className="btn-sketch" onClick={() => setWizardStep(3)}><ArrowLeft size={16} className="me-2" /> Back</button>
                          <button type="submit" className="btn-sketch-secondary">Draft My Blueprint</button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- DASHBOARD VIEW --- */}
        {view === 'dashboard' && reportData && (
          <div>
            <div className="row align-items-center mb-4 mt-2 no-print">
              <div className="col-md-8">
                <h1 className="title-sketch mb-0">My Career Blueprint</h1>
                <p className="text-muted fs-5">Crafted by AI based on your unique questionnaire responses.</p>
              </div>
              <div className="col-md-4 text-md-end">
                <button onClick={() => window.print()} className="btn-sketch-secondary">
                  <Printer size={16} className="me-2" /> Print Blueprint / PDF
                </button>
                <button onClick={() => { setWizardStep(1); setView('wizard'); }} className="btn-sketch ms-2">
                  <RotateCcw size={16} className="me-1" /> Retake Test
                </button>
              </div>
            </div>

            <div className="row">
              {/* Left Column: Student info and Strengths */}
              <div className="col-lg-4">
                <div className="sketch-card watercolor-bg-coral">
                  <h3 className="handwritten text-danger mb-3" style={{ fontSize: '2.2rem' }}>
                    <User className="me-2" size={24} /> Profile Snapshot
                  </h3>
                  <hr className="border-dark" />
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Age / Gender:</td>
                        <td>{profileData.age} / {profileData.gender}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Location:</td>
                        <td>{profileData.city}, {profileData.country}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Grades/GPA:</td>
                        <td>{profileData.percentage}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Target Goal:</td>
                        <td className="fw-bold highlight-yellow text-dark">{profileData.goal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sketch-card">
                  <h3 className="handwritten mb-3" style={{ fontSize: '2.2rem' }}>
                    <BarChart2 className="me-2" size={24} /> Career Strengths
                  </h3>
                  <hr className="border-dark" />
                  <div style={{ height: '250px', position: 'relative' }}>
                    <canvas ref={chartRef}></canvas>
                  </div>
                </div>

                <div className="sketch-card watercolor-bg-blue">
                  <h3 className="handwritten text-primary mb-3" style={{ fontSize: '2.2rem' }}>
                    <Palette className="me-2" size={24} /> Learning & Traits
                  </h3>
                  <hr className="border-dark" />
                  <h5 className="fw-bold text-dark mb-1">Learning Style:</h5>
                  <p className="text-muted mb-3">{reportData.learning_style}</p>
                  
                  <h5 className="fw-bold text-dark mb-1">Personality Profile:</h5>
                  <p className="text-muted mb-0">{reportData.personality_profile}</p>
                </div>
              </div>

              {/* Right Column: Careers matches */}
              <div className="col-lg-8">
                <div className="sketch-card watercolor-bg-yellow" style={{ transform: 'rotate(0.5deg)' }}>
                  <h3 className="handwritten mb-2" style={{ fontSize: '2rem' }}>Counselor Summary</h3>
                  <p className="mb-0 fs-5">{reportData.student_summary}</p>
                </div>

                <h2 className="title-sketch mb-4 text-center text-lg-start d-block" style={{ fontSize: '2.3rem' }}>Top Career Blueprints</h2>

                {reportData.top_career_matches && reportData.top_career_matches.map((match, idx) => {
                  let cardColor = 'watercolor-bg-blue';
                  if (idx === 1) cardColor = 'watercolor-bg-coral';
                  if (idx === 2) cardColor = 'watercolor-bg-yellow';

                  return (
                    <div className={`sketch-card ${cardColor}`} key={match.career}>
                      <div className="score-badge">{match.compatibility_score}% Match</div>
                      <h3 className="fw-bold mb-3 d-flex align-items-center" style={{ fontSize: '1.8rem', marginTop: '10px' }}>
                        <span className="badge bg-dark text-white rounded-circle me-3 d-inline-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', fontSize: '1.1rem' }}>{idx + 1}</span>
                        {match.career}
                      </h3>
                      
                      <p className="fs-5 mb-4 border-start border-dark border-3 ps-3 italic">{match.why_fit}</p>
                      
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <h5 className="fw-bold"><GraduationCap className="me-2 text-primary" size={18} /> Academic Degrees</h5>
                          <ul className="list-unstyled mb-0">
                            {match.recommended_degrees.map(deg => (
                              <li key={deg}><Check className="text-success me-2" size={14} />{deg}</li>
                            ))}
                            {match.alternative_degrees && match.alternative_degrees.map(deg => (
                              <li className="text-muted" key={deg}><RotateCcw className="me-2" size={14} />{deg} (Alt)</li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h5 className="fw-bold"><ShieldAlert className="me-2 text-danger" size={18} /> Certification & Skills</h5>
                          <ul className="list-unstyled mb-0">
                            {match.skills_to_learn.map(sk => (
                              <li key={sk}><Check className="text-warning me-2" size={14} />{sk}</li>
                            ))}
                            {match.certifications && match.certifications.map(cert => (
                              <li className="text-muted" key={cert}><Check className="me-2" size={14} />{cert}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <h5 className="fw-bold"><DollarSign className="me-2 text-success" size={18} /> Salary Potential</h5>
                          <div className="d-flex justify-content-between border-bottom pb-1 mb-1">
                            <span className="text-muted">Entry-Level:</span>
                            <span className="fw-bold">{match.salary_estimates.Entry}</span>
                          </div>
                          <div className="d-flex justify-content-between border-bottom pb-1 mb-1">
                            <span className="text-muted">Mid-Career:</span>
                            <span className="fw-bold">{match.salary_estimates.Mid}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Senior/Expert:</span>
                            <span className="fw-bold">{match.salary_estimates.Senior}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h5 className="fw-bold"><Briefcase className="me-2 text-info" size={18} /> Opportunity Areas</h5>
                          <p className="mb-1 fw-bold text-dark">Business Ideas:</p>
                          <ul className="list-unstyled mb-2">
                            {match.business_ideas.map(biz => (
                              <li key={biz}><Lightbulb className="text-warning me-2" size={14} />{biz}</li>
                            ))}
                          </ul>
                          {match.government_opportunities && (
                            <>
                              <p className="mb-1 fw-bold text-dark">Government & Public Sectors:</p>
                              <ul className="list-unstyled mb-0">
                                {match.government_opportunities.map(gov => (
                                  <li key={gov}><Landmark className="text-primary me-2" size={14} />{gov}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      <hr className="border-dark my-4" />

                      <h4 className="handwritten text-dark mb-3" style={{ fontSize: '2rem' }}><Route className="me-2" size={24} /> Detailed 5-Year Action Blueprint</h4>
                      <div className="roadmap-timeline">
                        <div className="roadmap-item">
                          <h6 className="fw-bold mb-1">Year 1 - Foundational Learning</h6>
                          <p className="text-muted small mb-0">{match.roadmap.year_1}</p>
                        </div>
                        <div className="roadmap-item">
                          <h6 className="fw-bold mb-1">Year 3 - Specialization & Projects</h6>
                          <p className="text-muted small mb-0">{match.roadmap.year_3}</p>
                        </div>
                        <div className="roadmap-item">
                          <h6 className="fw-bold mb-1">Year 5 - Leadership & Mastery</h6>
                          <p className="text-muted small mb-0">{match.roadmap.year_5}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="sketch-card watercolor-bg-yellow" style={{ transform: 'rotate(-0.5deg)' }}>
                  <h3 className="handwritten text-center mb-3" style={{ fontSize: '2.5rem' }}><Brain className="me-2" size={28} /> Counselor Encouragement</h3>
                  <p className="text-center fs-5 italic">"{reportData.encouragement}"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ADMIN VIEW --- */}
        {view === 'admin' && session && session.role === 'admin' && (
          <div>
            <div className="row mb-4">
              <div className="col-12">
                <h1 className="title-sketch"><Settings className="me-2" size={32} /> Admin Panel</h1>
                <p className="text-muted">Manage system questions, prompt engineering, and view platform statistics.</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex gap-2 flex-wrap text-center justify-content-start">
                  <button onClick={() => setAdminTab('overview')} className={`btn-sketch ${adminTab === 'overview' ? 'btn-sketch-primary text-white' : ''}`}>
                    <BarChart2 size={16} className="me-2" /> Overview
                  </button>
                  <button onClick={() => setAdminTab('questions')} className={`btn-sketch ${adminTab === 'questions' ? 'btn-sketch-primary text-white' : ''}`}>
                    <FileText size={16} className="me-2" /> Questions Manager
                  </button>
                  <button onClick={() => setAdminTab('careers')} className={`btn-sketch ${adminTab === 'careers' ? 'btn-sketch-primary text-white' : ''}`}>
                    <Briefcase size={16} className="me-2" /> Career Database
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`btn-sketch ${adminTab === 'settings' ? 'btn-sketch-primary text-white' : ''}`}>
                    <Settings size={16} className="me-2" /> Prompt & Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            {adminTab === 'overview' && (
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="sketch-card text-center watercolor-bg-blue">
                    <h2 className="display-4 fw-bold">{users.length}</h2>
                    <p className="handwritten text-muted mb-0" style={{ fontSize: '1.5rem' }}>Registered Users</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="sketch-card text-center watercolor-bg-coral">
                    <h2 className="display-4 fw-bold">{reports.length}</h2>
                    <p className="handwritten text-muted mb-0" style={{ fontSize: '1.5rem' }}>Roadmaps Created</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="sketch-card text-center watercolor-bg-yellow">
                    <h2 className="display-4 fw-bold">{questions.length}</h2>
                    <p className="handwritten text-muted mb-0" style={{ fontSize: '1.5rem' }}>Active Questions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {adminTab === 'questions' && (
              <div className="row">
                <div className="col-md-5 mb-4">
                  <div className="sketch-card watercolor-bg-coral">
                    <h4 className="handwritten mb-3" style={{ fontSize: '2rem' }}>Create New Question</h4>
                    <form onSubmit={handleAddQuestion}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Section Category</label>
                        <select className="form-select form-control-sketch" value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})}>
                          <option value="Education">Education</option>
                          <option value="Favorite Subjects">Favorite Subjects</option>
                          <option value="Interests">Interests</option>
                          <option value="Skill Ratings">Skill Ratings</option>
                          <option value="Personality">Personality</option>
                          <option value="Situational Questions">Situational Questions</option>
                          <option value="Career Preferences">Career Preferences</option>
                          <option value="Salary Expectations">Salary Expectations</option>
                          <option value="Study Commitment">Study Commitment</option>
                          <option value="Family Support">Family Support</option>
                          <option value="Dream & Goals">Dream & Goals</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Question Text</label>
                        <input type="text" className="form-control form-control-sketch" value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Question Type</label>
                        <select className="form-select form-control-sketch" value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})}>
                          <option value="mcq">Single Choice (Radio)</option>
                          <option value="multiselect">Multiple Choice (Checkbox)</option>
                          <option value="rating">Rating (1 to 5 Slider)</option>
                          <option value="text">Paragraph Answer</option>
                        </select>
                      </div>
                      {newQuestion.type !== 'rating' && newQuestion.type !== 'text' && (
                        <div className="mb-3">
                          <label className="form-label fw-bold">Options (One per line)</label>
                          <textarea rows="3" className="form-control form-control-sketch" value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} placeholder="Option A&#10;Option B" />
                        </div>
                      )}
                      <button type="submit" className="btn-sketch-primary w-100">Add Question</button>
                    </form>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="sketch-card">
                    <h4 className="handwritten mb-3" style={{ fontSize: '2rem' }}>Active Questions List</h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Question</th>
                            <th>Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.map(q => (
                            <tr key={q.id}>
                              <td><span className="badge bg-secondary">{q.category}</span></td>
                              <td><small>{q.question}</small></td>
                              <td><code>{q.type}</code></td>
                              <td>
                                <button className="btn btn-sm btn-outline-danger border-dark" onClick={() => handleDeleteQuestion(q.id)}><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Careers Tab */}
            {adminTab === 'careers' && (
              <div className="row">
                <div className="col-md-5 mb-4">
                  <div className="sketch-card watercolor-bg-yellow">
                    <h4 className="handwritten mb-3" style={{ fontSize: '2rem' }}>Add Career Path</h4>
                    <form onSubmit={handleAddCareer}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Career Name</label>
                        <input type="text" className="form-control form-control-sketch" value={newCareer.career} onChange={e => setNewCareer({...newCareer, career: e.target.value})} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea className="form-control form-control-sketch" value={newCareer.description} onChange={e => setNewCareer({...newCareer, description: e.target.value})} rows="2" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Recommended Degrees</label>
                        <input type="text" className="form-control form-control-sketch" value={newCareer.degree} onChange={e => setNewCareer({...newCareer, degree: e.target.value})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Core Skills</label>
                        <input type="text" className="form-control form-control-sketch" value={newCareer.skills} onChange={e => setNewCareer({...newCareer, skills: e.target.value})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Salary Range</label>
                        <input type="text" className="form-control form-control-sketch" value={newCareer.salary} onChange={e => setNewCareer({...newCareer, salary: e.target.value})} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Growth Outlook</label>
                        <input type="text" className="form-control form-control-sketch" value={newCareer.growth_rate} onChange={e => setNewCareer({...newCareer, growth_rate: e.target.value})} />
                      </div>
                      <button type="submit" className="btn-sketch-primary w-100">Add Career Path</button>
                    </form>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="sketch-card">
                    <h4 className="handwritten mb-3" style={{ fontSize: '2rem' }}>Platform Career Database</h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Career</th>
                            <th>Salary Range</th>
                            <th>Growth</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {careers.map(c => (
                            <tr key={c.id}>
                              <td>
                                <strong className="text-primary">{c.career}</strong><br />
                                <small className="text-muted">{c.degree}</small>
                              </td>
                              <td><small>{c.salary}</small></td>
                              <td><span className="badge bg-light text-dark border border-dark">{c.growth_rate}</span></td>
                              <td>
                                <button className="btn btn-sm btn-outline-danger border-dark" onClick={() => handleDeleteCareer(c.id)}><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {adminTab === 'settings' && (
              <div className="sketch-card">
                <h4 className="handwritten mb-4" style={{ fontSize: '2.2rem' }}>AI System Prompts & Keys</h4>
                <form onSubmit={handleSaveSettings}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">OpenAI API Key</label>
                    <input type="password" className="form-control form-control-sketch" value={adminApiKey} onChange={e => setAdminApiKey(e.target.value)} placeholder="sk-proj-..." />
                    <div className="form-text text-muted">
                      Leave empty to run the realistic mock counselor profiling framework locally inside the browser.
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">AI System Prompt Instructions</label>
                    <textarea rows="6" className="form-control form-control-sketch" value={adminSystemPrompt} onChange={e => setAdminSystemPrompt(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-sketch-primary">Save Configurations</button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="footer-sketch no-print">
        <div className="container">
          <p className="handwritten" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>"The best way to predict the future is to sketch it."</p>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} CareerMap AI. All rights reserved. Created with Art & React.
          </p>
        </div>
      </footer>
    </div>
  );
}
