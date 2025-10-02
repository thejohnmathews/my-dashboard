-- Insert fake mood entries for the last 3 months
-- Note: Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table

-- You can get your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Mood entries for the last 90 days
INSERT INTO mood_entries (user_id, mood, productivity, task, notes, created_at) VALUES
-- Recent entries (last 7 days)
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Worked on dashboard project', 'Great progress on the new features', NOW() - INTERVAL '1 day'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Finished the financial tracker', 'Really proud of the analytics', NOW() - INTERVAL '2 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Team meeting and emails', 'Standard workday', NOW() - INTERVAL '3 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Code review and bug fixes', 'Good collaboration with team', NOW() - INTERVAL '4 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 4, 'Dealing with production issues', 'Long day troubleshooting', NOW() - INTERVAL '5 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Client presentation went well', 'Positive feedback received', NOW() - INTERVAL '6 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Started new side project', 'Learning new technologies', NOW() - INTERVAL '7 days'),

-- Previous week
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 5, 'Administrative tasks', 'Caught up on documentation', NOW() - INTERVAL '8 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Pair programming session', 'Learned new patterns', NOW() - INTERVAL '9 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 8, 'Deployed new feature', 'Users are loving it', NOW() - INTERVAL '10 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Planning and estimation', 'Sprint planning meeting', NOW() - INTERVAL '11 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Code refactoring', 'Cleaned up technical debt', NOW() - INTERVAL '12 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'sad', 3, 'Failed deployment', 'Had to rollback changes', NOW() - INTERVAL '13 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 4, 'Tight deadline pressure', 'Working late to meet goals', NOW() - INTERVAL '14 days'),

-- Month 1 (15-45 days ago)
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Successfully launched feature', 'Great team collaboration', NOW() - INTERVAL '15 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Won hackathon', 'Built amazing prototype', NOW() - INTERVAL '18 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Regular development work', 'Implementing user stories', NOW() - INTERVAL '20 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Mentored junior developer', 'Satisfying knowledge sharing', NOW() - INTERVAL '22 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 5, 'Multiple urgent bugs', 'Firefighting mode', NOW() - INTERVAL '25 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 8, 'Got promoted', 'Recognition for hard work', NOW() - INTERVAL '28 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Team building event', 'Great team bonding', NOW() - INTERVAL '30 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Database optimization', 'Performance improvements', NOW() - INTERVAL '32 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Conference presentation', 'Shared knowledge with community', NOW() - INTERVAL '35 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Customer feedback session', 'Positive user experience', NOW() - INTERVAL '38 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 4, 'System outage', 'All hands on deck situation', NOW() - INTERVAL '40 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 5, 'Security audit', 'Compliance and documentation', NOW() - INTERVAL '42 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'New team member onboarding', 'Growing the team', NOW() - INTERVAL '45 days'),

-- Month 2 (46-75 days ago)
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 8, 'Started new project', 'Exploring new tech stack', NOW() - INTERVAL '46 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Code review culture', 'Improving code quality', NOW() - INTERVAL '48 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Testing and QA', 'Ensuring reliability', NOW() - INTERVAL '50 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 3, 'Major refactor needed', 'Legacy system challenges', NOW() - INTERVAL '52 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Automated deployment', 'DevOps improvements', NOW() - INTERVAL '55 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Open source contribution', 'Giving back to community', NOW() - INTERVAL '58 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 5, 'Meeting heavy day', 'Lots of coordination', NOW() - INTERVAL '60 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Performance optimization', 'App is much faster now', NOW() - INTERVAL '62 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'sad', 4, 'Feature got cancelled', 'Pivot in product strategy', NOW() - INTERVAL '65 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 8, 'Learning new framework', 'Expanding skill set', NOW() - INTERVAL '68 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Documentation updates', 'Keeping docs current', NOW() - INTERVAL '70 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Successful demo', 'Stakeholders impressed', NOW() - INTERVAL '72 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 5, 'Integration challenges', 'Third-party API issues', NOW() - INTERVAL '75 days'),

-- Month 3 (76-90 days ago)
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 8, 'Project kickoff', 'Exciting new challenges', NOW() - INTERVAL '76 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 9, 'Tech conference attended', 'Inspired by new ideas', NOW() - INTERVAL '78 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 6, 'Requirements gathering', 'Understanding user needs', NOW() - INTERVAL '80 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'happy', 7, 'Team workshop', 'Improved processes', NOW() - INTERVAL '82 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'stressed', 4, 'Scope creep issues', 'Managing expectations', NOW() - INTERVAL '85 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'excited', 8, 'Prototype completed', 'Proof of concept works', NOW() - INTERVAL '87 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 'neutral', 5, 'Research and planning', 'Architecture decisions', NOW() - INTERVAL '90 days');