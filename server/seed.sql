INSERT INTO users (email, first_name, last_name, role)
VALUES 
  ('alex.chen@example.com', 'Alex', 'Chen', 'job_seeker'),
  ('sarah.wilson@techstart.com', 'Sarah', 'Wilson', 'employer'),
  ('admin@pollen.com', 'Admin', 'User', 'admin');

INSERT INTO public.job_seeker_profiles (
  user_id,
  preferred_role,
  skills,
  portfolio_projects,
  profile_strength
) VALUES (
  (SELECT id FROM public.users WHERE email = 'alex.chen@example.com'),
  'Frontend Developer',
  '["React","TypeScript","JavaScript","CSS","Node.js"]'::jsonb,
  '[
    {
      "name": "E-commerce Platform",
      "url": "https://github.com/alexchen/ecommerce",
      "description": "Full-stack e-commerce platform built with React and Node.js"
    },
    {
      "name": "Task Management App",
      "url": "https://github.com/alexchen/taskapp",
      "description": "Collaborative task management application with real-time updates"
    }
  ]'::jsonb,
  85
)
RETURNING id;


INSERT INTO public.employer_profiles (
  user_id,
  company_name,
  company_size,
  industry,
  company_description,
  website
) VALUES (
  (SELECT id FROM public.users WHERE email = 'sarah.wilson@techstart.com'),
  'TechStart Inc.',
  '50-100',
  'Software Development',
  'We''re a fast-growing startup building the next generation of productivity tools for remote teams.',
  'https://techstart.com'
)
RETURNING id;

INSERT INTO public.challenges (
  title,
  description,
  instructions,
  difficulty,
  estimated_time,
  skills,
  max_score,
  is_active,
  usage_count,
  average_score
) VALUES 
(
  'React Component Challenge',
  'Build a responsive product card component with interactive features including image carousel, add to cart functionality, and rating system.',
  'Create a React component that displays product information in an attractive card format. The component should be fully responsive and include hover effects, image zoom, and smooth animations.',
  'intermediate',
  '2-3 hours',
  '["React","CSS","JavaScript"]'::jsonb,
  100,
  true,
  23,
  78.5
),
(
  'API Design Challenge',
  'Design and implement a RESTful API for a task management system with user authentication, CRUD operations, and real-time notifications.',
  'Build a complete backend API using Node.js and Express. Include proper error handling, input validation, and API documentation.',
  'advanced',
  '4-5 hours',
  '["Node.js","Express","MongoDB","REST API"]'::jsonb,
  100,
  true,
  15,
  82.3
)
RETURNING id, title;

-- Frontend Job
INSERT INTO public.jobs (
  employer_id,
  title,
  description,
  location,
  is_remote,
  salary_min,
  salary_max,
  required_skills,
  preferred_skills,
  status,
  challenge_id
) VALUES (
  (SELECT id FROM public.employer_profiles WHERE company_name = 'TechStart Inc.'),
  'Senior Frontend Developer',
  'Join our team to build the next generation of productivity tools. You''ll work on our React-based web application, focusing on user experience and performance optimization.',
  'San Francisco, CA',
  true,
  95000,
  130000,
  '["React","TypeScript","JavaScript"]'::jsonb,
  '["Node.js","GraphQL","AWS"]'::jsonb,
  'active',
  (SELECT id FROM public.challenges WHERE title = 'React Component Challenge')
);

-- Backend Job
INSERT INTO public.jobs (
  employer_id,
  title,
  description,
  location,
  is_remote,
  salary_min,
  salary_max,
  required_skills,
  preferred_skills,
  status,
  challenge_id
) VALUES (
  (SELECT id FROM public.employer_profiles WHERE company_name = 'TechStart Inc.'),
  'Backend Engineer',
  'Build scalable backend systems and APIs that power our platform. Work with modern technologies and contribute to architectural decisions.',
  'Remote',
  true,
  90000,
  125000,
  '["Node.js","Python","PostgreSQL"]'::jsonb,
  '["Docker","Kubernetes","AWS"]'::jsonb,
  'active',
  (SELECT id FROM public.challenges WHERE title = 'API Design Challenge')
);

INSERT INTO public.workflows (job_id, current_stage, total_stages, progress, status)
VALUES
  ((SELECT id FROM public.jobs WHERE title = 'Backend Engineer'), 'applications', 5, 20, 'active');


INSERT INTO public.applications (job_id, job_seeker_id, status, match_score, notes)
VALUES (
  (SELECT id FROM public.jobs WHERE title = 'Backend Engineer'),
  (SELECT id FROM public.job_seeker_profiles WHERE user_id = (SELECT id FROM public.users WHERE email = 'alex.chen@example.com')),
  'challenge_completed',
  94.5,
  'Excellent technical skills and great cultural fit'
)
RETURNING id;



INSERT INTO public.challenge_submissions (
  application_id,
  challenge_id,
  submission_url,
  submission_text,
  score,
  feedback,
  reviewed_by
) VALUES (
  (SELECT id FROM public.applications WHERE job_id = (SELECT id FROM public.jobs WHERE title = 'Backend Engineer')),
  (SELECT id FROM public.challenges WHERE title = 'React Component Challenge'),
  'https://github.com/alexchen/react-challenge',
  'I implemented the product card component with all requested features plus additional accessibility improvements and smooth animations.',
  92,
  'Excellent implementation with clean code structure and great attention to detail. The accessibility features are particularly impressive.',
  (SELECT id FROM public.users WHERE email = 'sarah.wilson@techstart.com')
);