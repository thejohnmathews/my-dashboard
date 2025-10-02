-- Insert fake financial entries for the last 3 months
-- Note: Replace '487e84be-ac3e-4b2a-b9d6-8ffb46ba0095' with your actual user ID from auth.users table

-- You can get your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Financial entries for the last 90 days
INSERT INTO financial_entries (user_id, amount, type, description, category, date, created_at) VALUES

-- Recent income entries
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 5000.00, 'income', 'Monthly Salary - October', 'salary', CURRENT_DATE - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'income', 'Freelance Web Development', 'freelance', CURRENT_DATE - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 500.00, 'income', 'Dividend Payment', 'investment', CURRENT_DATE - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Recent expenses - October
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'expense', 'Monthly Rent', 'bills', CURRENT_DATE - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 85.50, 'expense', 'Grocery Shopping - Whole Foods', 'food', CURRENT_DATE - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 45.00, 'expense', 'Gas Station Fill-up', 'transport', CURRENT_DATE - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 15.99, 'expense', 'Netflix Subscription', 'entertainment', CURRENT_DATE - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 120.00, 'expense', 'New Running Shoes', 'shopping', CURRENT_DATE - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 67.80, 'expense', 'Dinner with Friends', 'food', CURRENT_DATE - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 25.00, 'expense', 'Uber Ride', 'transport', CURRENT_DATE - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 150.00, 'expense', 'Electric Bill', 'bills', CURRENT_DATE - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 95.50, 'expense', 'Weekly Groceries', 'food', CURRENT_DATE - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 35.00, 'expense', 'Movie Tickets', 'entertainment', CURRENT_DATE - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 200.00, 'expense', 'New Laptop Charger', 'shopping', CURRENT_DATE - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 80.00, 'expense', 'Doctor Visit Co-pay', 'health', CURRENT_DATE - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 55.75, 'expense', 'Coffee Shop & Lunch', 'food', CURRENT_DATE - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 40.00, 'expense', 'Gas Station', 'transport', CURRENT_DATE - INTERVAL '14 days', NOW() - INTERVAL '14 days'),

-- September entries
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 5000.00, 'income', 'Monthly Salary - September', 'salary', CURRENT_DATE - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 800.00, 'income', 'Consulting Project', 'freelance', CURRENT_DATE - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'expense', 'Monthly Rent', 'bills', CURRENT_DATE - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 350.00, 'expense', 'Car Insurance', 'bills', CURRENT_DATE - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 125.00, 'expense', 'Phone Bill', 'bills', CURRENT_DATE - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 89.99, 'expense', 'Amazon Shopping', 'shopping', CURRENT_DATE - INTERVAL '26 days', NOW() - INTERVAL '26 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 450.00, 'expense', 'Grocery Shopping for Month', 'food', CURRENT_DATE - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 180.00, 'expense', 'Gas for Month', 'transport', CURRENT_DATE - INTERVAL '24 days', NOW() - INTERVAL '24 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 65.00, 'expense', 'Gym Membership', 'health', CURRENT_DATE - INTERVAL '23 days', NOW() - INTERVAL '23 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 45.00, 'expense', 'Streaming Services', 'entertainment', CURRENT_DATE - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 200.00, 'expense', 'New Headphones', 'shopping', CURRENT_DATE - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 75.50, 'expense', 'Date Night Dinner', 'food', CURRENT_DATE - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 120.00, 'expense', 'Haircut and Styling', 'other', CURRENT_DATE - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 95.00, 'expense', 'Weekly Groceries', 'food', CURRENT_DATE - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 30.00, 'expense', 'Coffee Subscription', 'food', CURRENT_DATE - INTERVAL '17 days', NOW() - INTERVAL '17 days'),

-- August entries
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 5000.00, 'income', 'Monthly Salary - August', 'salary', CURRENT_DATE - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1500.00, 'income', 'Bonus Payment', 'salary', CURRENT_DATE - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 600.00, 'income', 'Side Project Payment', 'freelance', CURRENT_DATE - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'expense', 'Monthly Rent', 'bills', CURRENT_DATE - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'expense', 'Vacation Trip', 'entertainment', CURRENT_DATE - INTERVAL '58 days', NOW() - INTERVAL '58 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 400.00, 'expense', 'Flight Tickets', 'transport', CURRENT_DATE - INTERVAL '57 days', NOW() - INTERVAL '57 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 300.00, 'expense', 'Hotel Stay', 'entertainment', CURRENT_DATE - INTERVAL '56 days', NOW() - INTERVAL '56 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 150.00, 'expense', 'Vacation Meals', 'food', CURRENT_DATE - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 250.00, 'expense', 'Vacation Shopping', 'shopping', CURRENT_DATE - INTERVAL '54 days', NOW() - INTERVAL '54 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 185.00, 'expense', 'Utility Bills', 'bills', CURRENT_DATE - INTERVAL '53 days', NOW() - INTERVAL '53 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 320.00, 'expense', 'Groceries for Month', 'food', CURRENT_DATE - INTERVAL '52 days', NOW() - INTERVAL '52 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 160.00, 'expense', 'Gas for Month', 'transport', CURRENT_DATE - INTERVAL '51 days', NOW() - INTERVAL '51 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 89.99, 'expense', 'Online Course', 'education', CURRENT_DATE - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 45.00, 'expense', 'Book Purchase', 'education', CURRENT_DATE - INTERVAL '49 days', NOW() - INTERVAL '49 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 120.00, 'expense', 'Medical Checkup', 'health', CURRENT_DATE - INTERVAL '48 days', NOW() - INTERVAL '48 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 75.00, 'expense', 'Concert Tickets', 'entertainment', CURRENT_DATE - INTERVAL '47 days', NOW() - INTERVAL '47 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 200.00, 'expense', 'New Clothes', 'shopping', CURRENT_DATE - INTERVAL '46 days', NOW() - INTERVAL '46 days'),

-- July entries
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 5000.00, 'income', 'Monthly Salary - July', 'salary', CURRENT_DATE - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 300.00, 'income', 'Cashback Rewards', 'other', CURRENT_DATE - INTERVAL '85 days', NOW() - INTERVAL '85 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 1200.00, 'expense', 'Monthly Rent', 'bills', CURRENT_DATE - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 280.00, 'expense', 'Groceries', 'food', CURRENT_DATE - INTERVAL '88 days', NOW() - INTERVAL '88 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 140.00, 'expense', 'Gas', 'transport', CURRENT_DATE - INTERVAL '87 days', NOW() - INTERVAL '87 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 95.00, 'expense', 'Internet Bill', 'bills', CURRENT_DATE - INTERVAL '86 days', NOW() - INTERVAL '86 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 150.00, 'expense', 'Summer Clothes', 'shopping', CURRENT_DATE - INTERVAL '85 days', NOW() - INTERVAL '85 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 60.00, 'expense', 'BBQ Supplies', 'food', CURRENT_DATE - INTERVAL '84 days', NOW() - INTERVAL '84 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 25.00, 'expense', 'Car Wash', 'transport', CURRENT_DATE - INTERVAL '83 days', NOW() - INTERVAL '83 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 180.00, 'expense', 'Dinner Party', 'food', CURRENT_DATE - INTERVAL '82 days', NOW() - INTERVAL '82 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 45.00, 'expense', 'Movie Night', 'entertainment', CURRENT_DATE - INTERVAL '81 days', NOW() - INTERVAL '81 days'),
('487e84be-ac3e-4b2a-b9d6-8ffb46ba0095', 220.00, 'expense', 'Home Supplies', 'other', CURRENT_DATE - INTERVAL '80 days', NOW() - INTERVAL '80 days');