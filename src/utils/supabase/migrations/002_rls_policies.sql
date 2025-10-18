-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Super admin has full access" ON users FOR ALL USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'super_admin'
)) WITH CHECK (true);

CREATE POLICY "Admins can manage users with roles client and architect" ON users FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    AND (role IN ('client', 'architect'))
) WITH CHECK (true);

-- Projects policies
CREATE POLICY "Architects can access own projects" ON projects FOR ALL USING (
    architect_id = auth.uid()
) WITH CHECK (true);

CREATE POLICY "Structural team can access assigned projects" ON projects FOR ALL USING (
    structural_team_id = auth.uid()
) WITH CHECK (true);

-- Similar policies for uploads and messages
-- ... (more detailed RLS policies would go here)