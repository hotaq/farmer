-- Agri-Connect Database Schema
-- This file contains the complete database schema for the Agri-Connect platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('producer', 'partner', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'producer',
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    postal_code TEXT,
    bio TEXT,
    company_name TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    producer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    quantity_available INTEGER NOT NULL DEFAULT 0,
    minimum_order INTEGER DEFAULT 1,
    harvest_date DATE,
    expiry_date DATE,
    organic_certified BOOLEAN DEFAULT FALSE,
    location TEXT,
    status product_status DEFAULT 'draft',
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    producer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table (conversation between users)
CREATE TABLE chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_1, participant_2)
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites/Wishlist table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_products_producer_id ON products(producer_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_partner_id ON orders(partner_id);
CREATE INDEX idx_orders_producer_id ON orders(producer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (status = 'active' OR producer_id = auth.uid());

CREATE POLICY "Producers can manage own products" ON products
    FOR ALL USING (producer_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (partner_id = auth.uid() OR producer_id = auth.uid());

CREATE POLICY "Partners can create orders" ON orders
    FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (partner_id = auth.uid() OR producer_id = auth.uid());

-- Chats policies
CREATE POLICY "Users can view own chats" ON chats
    FOR SELECT USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "Users can create chats" ON chats
    FOR INSERT WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in own chats" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.participant_1 = auth.uid() OR chats.participant_2 = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in own chats" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.participant_1 = auth.uid() OR chats.participant_2 = auth.uid())
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Functions for common operations

-- Function to create a new chat between two users
CREATE OR REPLACE FUNCTION create_chat(participant_1_id UUID, participant_2_id UUID)
RETURNS UUID AS $$
DECLARE
    chat_id UUID;
BEGIN
    -- Check if chat already exists
    SELECT id INTO chat_id FROM chats 
    WHERE (chats.participant_1 = participant_1_id AND chats.participant_2 = participant_2_id)
       OR (chats.participant_1 = participant_2_id AND chats.participant_2 = participant_1_id);
    
    -- If chat doesn't exist, create it
    IF chat_id IS NULL THEN
        INSERT INTO chats (participant_1, participant_2)
        VALUES (participant_1_id, participant_2_id)
        RETURNING id INTO chat_id;
    END IF;
    
    RETURN chat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_products', (
            SELECT COUNT(*) FROM products WHERE producer_id = user_id
        ),
        'active_products', (
            SELECT COUNT(*) FROM products WHERE producer_id = user_id AND status = 'active'
        ),
        'total_orders', (
            SELECT COUNT(*) FROM orders WHERE producer_id = user_id OR partner_id = user_id
        ),
        'completed_orders', (
            SELECT COUNT(*) FROM orders WHERE (producer_id = user_id OR partner_id = user_id) AND status = 'delivered'
        ),
        'average_rating', (
            SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = user_id
        ),
        'total_reviews', (
            SELECT COUNT(*) FROM reviews WHERE reviewee_id = user_id
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for development
-- Note: This should be removed in production

-- Sample categories for products
INSERT INTO products (producer_id, name, description, category, price, unit, quantity_available, status) VALUES
('00000000-0000-0000-0000-000000000000', 'Sample Tomatoes', 'Fresh organic tomatoes', 'Vegetables', 50.00, 'kg', 100, 'active'),
('00000000-0000-0000-0000-000000000000', 'Sample Rice', 'Premium basmati rice', 'Grains', 80.00, 'kg', 500, 'active'),
('00000000-0000-0000-0000-000000000000', 'Sample Apples', 'Fresh red apples', 'Fruits', 120.00, 'kg', 200, 'active')
ON CONFLICT DO NOTHING;

-- Create storage buckets (to be run after Supabase project setup)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', false);

-- Storage policies (to be created after buckets)
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
--     FOR SELECT USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload own avatar" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Product images are publicly accessible" ON storage.objects
--     FOR SELECT USING (bucket_id = 'products');

-- CREATE POLICY "Producers can upload product images" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);