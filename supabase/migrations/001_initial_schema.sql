-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'architect', 'structural_team', 'client');

-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Packages table
CREATE TABLE packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL
);

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES users(id) NOT NULL,
    architect_id UUID REFERENCES users(id) NOT NULL,
    structural_team_id UUID REFERENCES users(id) NOT NULL,
    package_id UUID REFERENCES packages(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Uploads/files table
CREATE TABLE uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'jpeg')),
    version TEXT,
    notes TEXT,
    url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    project_id UUID REFERENCES projects(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES users(id) NOT NULL,
    recipient_id UUID REFERENCES users(id) NOT NULL,
    project_id UUID REFERENCES projects(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Insert initial data
INSERT INTO users (email, full_name, role) VALUES
('super@quadplus.com', 'Super Admin', 'super_admin'),
('admin@quadplus.com', 'Admin User', 'admin'),
('architect@quadplus.com', 'Architect User', 'architect'),
('structural@quadplus.com', 'Structural Team User', 'structural_team'),
('client@quadplus.com', 'Client User', 'client');

INSERT INTO packages (name, description, price) VALUES
('Good Plus', 'Basic consultation and 2D layouts', 29),
('Better Plus', '2D + basic 3D visualization', 99),
('Quad Plus', 'Full architectural design with 3D renders', 129),
('Luxury Plus', 'Premium design with interiors and site coordination', 149);

INSERT INTO projects (name, description, client_id, architect_id, structural_team_id, package_id) VALUES
('Sample Project', 'Initial sample project', 
 (SELECT id FROM users WHERE email = 'client@quadplus.com'),
 (SELECT id FROM users WHERE email = 'architect@quadplus.com'),
 (SELECT id FROM users WHERE email = 'structural@quadplus.com'),
 (SELECT id FROM packages WHERE name = 'Quad Plus'));

INSERT INTO uploads (file_name, file_type, version, notes, url, uploaded_by, project_id) VALUES
('sample.pdf', 'pdf', '1.0', 'Initial document', 'https://example.com/sample.pdf',
 (SELECT id FROM users WHERE email = 'client@quadplus.com'),
 (SELECT id FROM projects WHERE name = 'Sample Project'));

INSERT INTO messages (sender_id, recipient_id, project_id, content) VALUES
((SELECT id FROM users WHERE email = 'client@quadplus.com'), 
 (SELECT id FROM users WHERE email = 'architect@quadplus.com'),
 (SELECT id FROM projects WHERE name = 'Sample Project'),
 'Hello, I have a question about the project design.');