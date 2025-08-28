-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  ivy_coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  instructor TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  max_points INTEGER DEFAULT 100,
  due_date TIMESTAMP WITH TIME ZONE,
  assignment_type TEXT DEFAULT 'assignment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user assignments table (tracks individual user progress)
CREATE TABLE public.user_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'graded')),
  earned_points INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, assignment_id)
);

-- Create planner entries table
CREATE TABLE public.planner_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mindmaps table
CREATE TABLE public.mindmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ivy shop items table
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  category TEXT DEFAULT 'reward',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user purchases table
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE,
  coins_spent INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses policies (public read access)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

-- Assignments policies (public read access)
CREATE POLICY "Anyone can view assignments" ON public.assignments FOR SELECT USING (true);

-- User assignments policies
CREATE POLICY "Users can view own assignments" ON public.user_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assignments" ON public.user_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assignments" ON public.user_assignments FOR UPDATE USING (auth.uid() = user_id);

-- Planner entries policies
CREATE POLICY "Users can manage own planner entries" ON public.planner_entries FOR ALL USING (auth.uid() = user_id);

-- Mindmaps policies
CREATE POLICY "Users can manage own mindmaps" ON public.mindmaps FOR ALL USING (auth.uid() = user_id);

-- Shop items policies (public read access)
CREATE POLICY "Anyone can view shop items" ON public.shop_items FOR SELECT USING (true);

-- User purchases policies
CREATE POLICY "Users can view own purchases" ON public.user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can make purchases" ON public.user_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can insert own analytics" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', new.email);
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mindmaps_updated_at BEFORE UPDATE ON public.mindmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- Insert sample courses
INSERT INTO public.courses (name, instructor, description, color) VALUES
('Advanced Physics', 'Dr. Sarah Chen', 'Quantum mechanics and modern physics concepts', 'blue'),
('Calculus III', 'Prof. Michael Rodriguez', 'Multivariable calculus and vector analysis', 'green'),
('Computer Science', 'Ms. Emily Watson', 'Data structures and algorithms', 'purple'),
('Chemistry Lab', 'Dr. James Park', 'Advanced organic chemistry laboratory', 'orange'),
('Biology', 'Dr. Lisa Thompson', 'Molecular biology and genetics', 'teal');

-- Insert sample assignments
INSERT INTO public.assignments (course_id, title, description, max_points, due_date) 
SELECT 
  c.id,
  CASE 
    WHEN c.name = 'Advanced Physics' THEN 'Quantum States Lab Report'
    WHEN c.name = 'Calculus III' THEN 'Vector Fields Problem Set'
    WHEN c.name = 'Computer Science' THEN 'Binary Tree Implementation'
    WHEN c.name = 'Chemistry Lab' THEN 'Synthesis Experiment'
    WHEN c.name = 'Biology' THEN 'DNA Analysis Project'
  END,
  'Complete the assigned tasks and submit your work',
  100,
  now() + INTERVAL '7 days'
FROM public.courses c;

-- Insert sample shop items
INSERT INTO public.shop_items (name, description, cost, category) VALUES
('$10 Amazon Gift Card', 'Digital gift card for Amazon purchases', 100, 'giftcard'),
('$5 Starbucks Gift Card', 'Coffee shop gift card', 50, 'giftcard'),
('Out-of-Uniform Pass', 'Wear casual clothes for one day', 75, 'pass'),
('No Homework Pass', 'Skip homework for one assignment', 80, 'pass'),
('Skip School Day', 'Approved absence for one day', 200, 'pass'),
('Extra Credit Points', 'Add 5 points to any assignment', 60, 'academic'),
('Library VIP Access', 'Priority access to study rooms', 40, 'privilege');