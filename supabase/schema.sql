-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PRODUCTS TABLE
create table products (
  id text primary key, -- Keeping text id to match existing logic (e.g. 'prod-1') or use uuid
  name text not null,
  price numeric not null,
  description text,
  "detailedDescription" text,
  image text,
  category text,
  stock text check (stock in ('in-stock', 'out-of-stock', 'low-stock')),
  variants text[], -- Array of strings
  specifications jsonb, -- Key-value pairs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Products
alter table products enable row level security;
-- Allow everyone to read products
create policy "Public products are viewable by everyone" on products for select using (true);
-- Allow admins (servicerole) to update. For simplicity in this script we won't define complex admin roles for the app user yet, 
-- relying on Dashboard usage or authenticated users if we add an 'admin' flag to profiles.

-- PROFILES (USERS) TABLE - Extends auth.users
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text default 'customer' check (role in ('admin', 'distributor', 'customer')),
  "distributorId" text, -- If role is distributor
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- DISTRIBUTORS TABLE
create table distributors (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text,
  "couponCode" text unique,
  "isActive" boolean default true,
  "details" jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table distributors enable row level security;
create policy "Distributors viewable by everyone (for validation)" on distributors for select using (true);

-- ORDERS TABLE
create table orders (
  id text primary key, -- 'order-123...'
  user_id uuid references auth.users, -- link to auth user if logged in
  "date" timestamp with time zone default timezone('utc'::text, now()) not null,
  "customerName" text,
  phone text,
  email text,
  address text,
  items jsonb not null, -- Storing snapshot of cart items { productId, quantity, product: {...} }
  total numeric not null,
  status text check (status in ('new', 'processing', 'shipped', 'delivered')),
  "couponCode" text,
  "paymentMethod" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;
create policy "Users can view their own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);

-- ADDRESSES TABLE
create table addresses (
  id text primary key,
  user_id uuid references auth.users not null,
  name text,
  street text,
  city text,
  state text,
  zip text,
  phone text,
  type text check (type in ('home', 'work', 'other')),
  "isDefault" boolean default false
);

alter table addresses enable row level security;
create policy "Users can crud their own addresses" on addresses for all using (auth.uid() = user_id);

-- WISHLIST TABLE
create table wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  "productId" text references products(id),
  unique(user_id, "productId")
);

alter table wishlist enable row level security;
create policy "Users can crud their own wishlist" on wishlist for all using (auth.uid() = user_id);

-- SEED DATA (Products)
insert into products (id, name, price, category, description, "detailedDescription", stock, image, specifications)
values
('prod-1', 'Classic Minimalist Watch', 12500, 'Timepieces', 'Elegant timepiece with genuine leather strap.', 'A timeless classic feature...', 'in-stock', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=988&auto=format&fit=crop', '{"Brand": "Essence", "Material": "Stainless Steel"}'),
('prod-2', 'Premium Leather Weekender', 8900, 'Travel', 'Handcrafted leather bag.', 'Crafted from full-grain...', 'in-stock', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop', '{"Brand": "Nomad"}'),
('prod-3', 'Aviator Sunglasses', 4500, 'Accessories', 'Classic aviator style.', 'Timeless design...', 'in-stock', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop', '{"Brand": "RayBan-ish"}');
-- (Truncated seed data for brevity, but functionality remains)

-- BANNERS TABLE
create table banners (
  id text primary key,
  image text,
  title text,
  subtitle text,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table banners enable row level security;
create policy "Public banners" on banners for select using (true);

-- REWARDS (Spin Wheel) TABLE
create table rewards (
  id text primary key,
  label text,
  color text,
  "textColor" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table rewards enable row level security;
create policy "Public rewards" on rewards for select using (true);

-- PAGE CONFIGS TABLE (About, Contact)
create table page_configs (
  key text primary key, -- 'about', 'contact'
  value jsonb not null
);
alter table page_configs enable row level security;
create policy "Public configs" on page_configs for select using (true);

-- SEED DATA (Configs)
insert into page_configs (key, value)
values
('about', '{"heroTitle": "Our Story", "storyContent": "Welcome to EliteBazar."}'),
('contact', '{"email": "support@elitebazar.com"}');

-- ADMIN POLICIES
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can view all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can view all addresses" on addresses for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
