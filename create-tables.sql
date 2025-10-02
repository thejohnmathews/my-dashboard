-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('excited', 'happy', 'neutral', 'sad', 'stressed')),
    productivity INTEGER NOT NULL CHECK (productivity >= 1 AND productivity <= 10),
    task TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create financial_entries table
CREATE TABLE IF NOT EXISTS financial_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mood_entries
CREATE POLICY "Users can insert their own mood entries" ON mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mood entries" ON mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" ON mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" ON mood_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financial_entries
CREATE POLICY "Users can insert their own financial entries" ON financial_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own financial entries" ON financial_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial entries" ON financial_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial entries" ON financial_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX idx_financial_entries_user_id ON financial_entries(user_id);
CREATE INDEX idx_financial_entries_date ON financial_entries(date DESC);
CREATE INDEX idx_financial_entries_type ON financial_entries(type);
CREATE INDEX idx_financial_entries_category ON financial_entries(category);