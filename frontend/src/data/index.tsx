import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHistory,
} from '@tabler/icons-react';

export interface NavItem {
  name: string;
  link: string;
}
// For gridItems (about section on the landing page)
export const gridItems = [
  {
    id: 1,
    title: 'Visualize your growth with interactive dashboard elements. ',
    description: '',
    className: 'lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]',
    imgClassName: 'w-full h-full',
    titleClassName: 'justify-end',
    img: '/mockup.png',
    spareImg: '',
  },
  {
    id: 2,
    title: 'Your journey to success knows no borders',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '',
    spareImg: '',
  },
  {
    id: 3,
    title: 'Job Preparation',
    description: 'Get ready for your dream role',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-center',
    img: '',
    spareImg: '',
  },
  {
    id: 4,
    title: 'Refine your answers with AI feedback',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },

  {
    id: 5,
    title: '',
    description: '',
    className: 'md:col-span-3 md:row-span-2',
    imgClassName: 'absolute right-0 bottom-0 md:w-96 w-60',
    titleClassName: 'justify-center md:justify-start lg:justify-center',
    img: '',
    spareImg: '/grid.svg',
  },
  {
    id: 6,
    title: 'Ready to take the next step in your career?',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-center md:max-w-full max-w-60 text-center',
    img: '',
    spareImg: '',
  },
];
// For sticky-scroll-reveal(inside the about section)
export const content = [
  {
    title: 'Personalize Your Interview',
    description: (
      <ul>
        <li>- Select the job title that aligns with your career goals.</li>
        <li>- Choose the interview duration that fits your schedule.</li>
        <li>- Set the difficulty level to match your preparedness.</li>
        <li>
          - Provide a job description to tailor the interview to real-world
          scenarios.
        </li>
      </ul>
    ),
    content: (
      <img
        src="/819shots_so.png"
        className="object-cover object-center w-full h-full"
        alt="interview process"
      />
    ),
  },
  {
    title: 'Conduct the Interview',
    description: (
      <ul>
        <li>
          - Answer LLM-generated questions designed for your chosen role and
          difficulty.
        </li>
        <li>
          - Receive instant feedback to refine and improve your responses.
        </li>
        <li>
          - Edit and resubmit answers until satisfied with your performance.
        </li>
        <li>- Experience a dynamic, interactive interview simulation.</li>
      </ul>
    ),
    content: (
      <img
        src="/phase2.png"
        className="object-cover object-center w-full h-full"
        alt="interview process"
      />
    ),
  },
  {
    title: 'Analyze Your Performance',
    description: (
      <ul>
        <li>- Get an AI-generated scorecard that evaluates your answers.</li>
        <li>
          - Understand your performance across metrics like tone, clarity, and
          accuracy.
        </li>
        <li>
          - View your results through detailed visualizations for easy
          interpretation.
        </li>
        <li>
          - Receive actionable insights to help you improve and excel in real
          interviews.
        </li>
      </ul>
    ),
    content: (
      <img
        src="/phase3.png"
        className="object-cover w-full h-full"
        alt="interview process"
      />
    ),
  },
];

// For sidebar options(on the dashboard)
export const links = [
  {
    id: 1,
    label: 'Profile',
    href: '#',
    icon: (
      <IconUserBolt className="text-neutral-200 h-5 w-5 flex-shrink-0 z-10" />
    ),
  },
  {
    id: 2,
    label: 'Interviews',
    href: '#',
    icon: (
      <IconBrandTabler className="text-neutral-200 h-5 w-5 flex-shrink-0 z-10" />
    ),
  },
  {
    id: 3,
    label: 'History',
    href: '#',
    icon: (
      <IconHistory className="text-neutral-200 h-5 w-5 flex-shrink-0 z-10" />
    ),
  },
  {
    id: 4,
    label: 'Settings',
    href: '#',
    icon: (
      <IconSettings className="text-neutral-200 h-5 w-5 flex-shrink-0 z-10" />
    ),
  },
  {
    id: 5,
    label: 'Logout',
    href: '#',
    icon: (
      <IconArrowLeft className="text-neutral-200 h-5 w-5 flex-shrink-0 z-10" />
    ),
  },
];

// INterview Types for interview option on the dashboard
export const interviews = [
  {
    id: 1,
    title: 'Text interview',
    img: './grid.svg',
    description: 'Get well prepared with',
    linkHref: '/textual-interview/setup',
  },
  {
    id: 2,
    title: 'Video interview',
    img: './grid.svg',
    description: "SmartPrep's exclusive platform for",
    linkHref: '/video-interview/setup',
  },
];
// For FAQ of landing page
export const faq = [
  {
    id: '1',
    question: 'How is this different from using ChatGPT?',
    answer:
      'Unlike ChatGPT, Our platform specializes in interview preparation, providing real-life simulations, personalized feedback, and multiple interview formats.',
  },
  {
    id: '2',
    question: 'What languages do we support?',
    answer:
      'Currently, we support English as the primary language. We are planning to expand our platform to support additional languages in the near future.',
  },
  {
    id: '3',
    question: 'Why did we make this website?',
    answer:
      'We created this website to help individuals prepare for interviews through realistic mock interviews, AI-driven feedback, and various formats tailored to different job roles.',
  },
  {
    id: '4',
    question: 'Is the website free?',
    answer:
      'Yes, our platform is free to use, offering full access to mock interviews and feedback.',
  },
  {
    id: '5',
    question: 'Will I get feedback after my interview?',
    answer:
      "Yes, after completing your mock interview, you'll receive AI-generated feedback that includes insights on your performance, strengths, and areas to improve.",
  },
  {
    id: '6',
    question: 'How do I know my interview skills are improving?',
    answer:
      'We track your progress over time, showing how your performance evolves with each mock interview using different visual tools like graphs.',
  },
  {
    id: '7',
    question: 'Do I need a good camera and internet for a mock interview?',
    answer:
      'Yes, for video-based interviews, we recommend having a good quality camera and a stable internet connection to ensure clear visibility and smooth communication during the interview.',
  },
  {
    id: '8',
    question: 'Are the results always accurate?',
    answer:
      "Our AI-based feedback is highly accurate, but results may vary depending on factors such as interview context, content delivery, and AI's ability to interpret responses. We recommend supplementing the feedback with human review for a holistic perspective.",
  },
];

// For nav items of the landing page

export const navItems: NavItem[] = [
  { name: 'About', link: '#about' },
  { name: 'Approach', link: '#approach' },
  { name: 'FAQ', link: '#FAQ' },
  { name: 'Contact', link: '#contact' },
];
// For resume upload page
export const words = [
  {
    text: "Let's",
  },
  {
    text: 'shape',
  },
  {
    text: 'your',
  },
  {
    text: 'future',
  },
  {
    text: 'together.',
    className: 'text-[#a9c6f5]',
  },
];
// list of programming languages
export const programmingLanguages = [
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'PHP',
  'Ruby',
  'Go',
  'Swift',
  'Kotlin',
  'R',
  'TypeScript',
  'Scala',
  'Perl',
  'Haskell',
  'Rust',
  'Dart',
  'Elixir',
  'Lua',
  'MATLAB',
  'Shell',
  'HTML',
  'CSS',
  'SQL',
  'Objective-C',
  'Assembly',
  'Fortran',
  'COBOL',
  'Erlang',
  'F#',
  'Clojure',
];
// list of databases
export const databases = [
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'SQLite',
  'OracleDB',
  'Microsoft SQL Server',
  'Cassandra',
  'Redis',
  'Elasticsearch',
  'Firebase Realtime Database',
  'DynamoDB',
  'Couchbase',
  'MariaDB',
  'Neo4j',
  'Apache HBase',
  'IBM Db2',
  'Amazon Aurora',
  'CockroachDB',
  'Amazon Redshift',
  'Snowflake',
  'InfluxDB',
  'Google BigQuery',
  'ArangoDB',
  'Memcached',
  'RethinkDB',
  'ClickHouse',
  'H2',
  'OrientDB',
  'Teradata',
  'Presto',
];

// List of Frameworks/Libraries
export const frameworksLibraries = [
  'React',
  'Angular',
  'Vue.js',
  'Svelte',
  'Ember.js',
  'Backbone.js',
  'jQuery',
  'Next.js',
  'Nuxt.js',
  'Gatsby',
  'Express',
  'NestJS',
  'Koa',
  'Django',
  'Flask',
  'Ruby on Rails',
  'Spring',
  'Laravel',
  'ASP.NET',
  'FastAPI',
  'Symfony',
  'CodeIgniter',
  'Bootstrap',
  'Tailwind CSS',
  'Material-UI',
  'Chakra UI',
  'Ant Design',
  'Redux',
  'MobX',
  'RxJS',
  'Chart.js',
  'Three.js',
  'Lodash',
  'Moment.js',
  'TensorFlow',
  'PyTorch',
  'Hugging Face Transformers',
  'OpenCV',
  'Sequelize',
  'Mongoose',
  'Prisma',
  'Jest',
  'Mocha',
  'Cypress',
  'Puppeteer',
  'Playwright',
  'Webpack',
  'Rollup',
  'Parcel',
  'Babel',
  'Storybook',
  'Electron',
];

// List of soft skills
export const softSkills = [
  'Communication',
  'Teamwork',
  'Leadership',
  'Problem-Solving',
  'Time Management',
  'Adaptability',
  'Creativity',
  'Conflict Resolution',
  'Critical Thinking',
  'Emotional Intelligence',
  'Collaboration',
  'Decision-Making',
  'Empathy',
  'Negotiation',
  'Attention to Detail',
];
// for interview Setup form
export const Jobs = [
  {
    JobRole: 'Software Engineer',
    JobDescription:
      "We're looking for a talented and enthusiastic Software Engineer to join our dynamic team at [Your Company Name]. This role offers an exciting opportunity to work on innovative projects and develop cutting-edge software solutions that make a real impact. The successful candidate will be a problem-solver, a creative thinker, and a team player who is passionate about technology and software development.",
  },

  {
    JobRole: 'Product Manager',
    JobDescription:
      'We are seeking a skilled and innovative Product Manager to join our team at [Your Company Name]. The ideal candidate will drive the development and launch of new products, manage the product lifecycle, and collaborate with cross-functional teams to ensure successful product delivery. Responsibilities include defining product vision and strategy, gathering and prioritizing product requirements, conducting market research, and overseeing product development. A Bachelor’s degree in Business, Engineering, or a related field, and proven experience in product management are required. Strong analytical, communication, and leadership skills are essential.',
  },

  {
    JobRole: 'Financial Analyst',
    JobDescription:
      'We are looking for a detail-oriented Financial Analyst to join our finance team at [Your Company Name]. The successful candidate will analyze financial data, create financial models, and provide insights to support decision-making. Key responsibilities include preparing financial reports, conducting variance analysis, forecasting, and assisting with budgeting processes. The ideal candidate should have a Bachelor’s degree in Finance, Accounting, or a related field, and experience in financial analysis. Proficiency in financial software, strong analytical skills, and attention to detail are essential.',
  },
  {
    JobRole: 'Product Designer',
    JobDescription:
      'We are seeking a creative and passionate Product Designer to join our design team at [Your Company Name]. The ideal candidate will design and improve user experiences for our products, collaborate with product managers and engineers, and create prototypes and wireframes. Responsibilities include conducting user research, developing design concepts, and refining designs based on feedback. A Bachelor’s degree in Design, UX/UI, or a related field, and proven experience in product design are required. Strong design portfolio, proficiency in design tools, and excellent communication skills are essential.',
  },

  {
    JobRole: 'Technical Program Manager',
    JobDescription:
      'We are looking for an organized and driven Technical Program Manager to join our team at [Your Company Name]. The successful candidate will manage complex technical projects, coordinate with cross-functional teams, and ensure timely delivery of project milestones. Responsibilities include defining project scope, developing project plans, managing risks, and communicating progress to stakeholders. A Bachelor’s degree in Engineering, Computer Science, or a related field, and experience in technical program management are required. Strong project management skills, technical knowledge, and leadership abilities are essential.',
  },

  {
    JobRole: 'Business Analyst',
    JobDescription:
      'We are seeking a highly analytical Business Analyst to join our team at [Your Company Name]. The ideal candidate will analyze business processes, identify opportunities for improvement, and support decision-making through data analysis. Responsibilities include gathering and documenting business requirements, conducting market research, and developing process improvement strategies. A Bachelor’s degree in Business, Economics, or a related field, and proven experience in business analysis are required. Strong analytical, problem-solving, and communication skills are essential.',
  },

  {
    JobRole: 'Sales Representative',
    JobDescription:
      'We are looking for a dynamic Sales Representative to join our sales team at [Your Company Name]. The successful candidate will identify and pursue new sales opportunities, build relationships with clients, and achieve sales targets. Responsibilities include conducting sales presentations, negotiating contracts, and providing excellent customer service. A Bachelor’s degree in Business, Marketing, or a related field, and proven experience in sales are required. Strong communication, negotiation, and interpersonal skills are essential.',
  },

  {
    JobRole: 'Marketing Analyst',
    JobDescription:
      'We are seeking a data-driven Marketing Analyst to join our marketing team at [Your Company Name]. The ideal candidate will analyze marketing data, provide insights to optimize marketing strategies, and measure campaign effectiveness. Responsibilities include conducting market research, analyzing customer data, and creating reports on marketing performance. A Bachelor’s degree in Marketing, Business, or a related field, and experience in marketing analysis are required. Proficiency in analytics tools, strong analytical skills, and attention to detail are essential.',
  },
];
// For interview setup form
export const difficultyLevels = [
  {
    title: 'easy',
    icon: '/low-speed.png',
  },
  {
    title: 'medium',
    icon: '/difficulties.png',
  },
  {
    title: 'hard',
    icon: '/difficulty-breathing.png',
  },
];
// For interview Lengths
export const interviewLengths = [
  { label: 'Short', description: '5 Questions' },
  { label: 'Medium', description: '10 Questions' },
  { label: 'Long', description: '15 Questions' },
];
