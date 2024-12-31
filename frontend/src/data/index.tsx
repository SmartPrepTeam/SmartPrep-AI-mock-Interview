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
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Personalization Tools
      </div>
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
        src="/step1.png"
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
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Performance Metrics
      </div>
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
    linkHref: '/interview-setup',
  },
  {
    id: 2,
    title: 'Video interview',
    img: './grid.svg',
    description: "SmartPrep's exclusive platform for",
    linkHref: '/interview-setup',
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
