-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  countryCode TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for status field for better query performance
CREATE INDEX idx_messages_status ON messages(status);

-- Create index for user_id for user-specific queries
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- Enable Row Level Security (RLS) if you want to control access
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Sample policy: Users can see their own messages
CREATE POLICY "Users can view their own messages" 
ON messages FOR SELECT 
USING (auth.uid() = user_id);

-- Sample policy: Users can create messages
CREATE POLICY "Users can create messages" 
ON messages FOR INSERT 
WITH CHECK (true);