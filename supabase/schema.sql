create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'quoted', 'printing', 'finished', 'cancelled')),

  customer_name text not null check (char_length(customer_name) between 1 and 160),
  customer_phone text not null check (char_length(customer_phone) between 1 and 80),
  customer_email text not null check (customer_email ~* '^[^@]+@[^@]+\.[^@]+$'),
  customer_note text,

  file_name text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 104857600),
  file_path text not null,
  file_delete_after date,

  material_id text not null,
  material_name text not null,
  density numeric(10, 4) not null,
  price_per_gram numeric(10, 2) not null,
  infill_percent integer not null check (infill_percent between 1 and 100),
  layer_height numeric(10, 3) not null,
  quantity integer not null check (quantity > 0),

  dimension_x numeric(12, 3) not null,
  dimension_y numeric(12, 3) not null,
  dimension_z numeric(12, 3) not null,
  volume_cm3 numeric(12, 3) not null,
  triangle_count integer not null check (triangle_count > 0),
  model_too_large boolean not null default false,

  estimated_weight numeric(12, 3) not null,
  estimated_print_time_hours numeric(12, 3) not null,
  estimated_price numeric(12, 2) not null,
  final_price numeric(12, 2),
  price_breakdown jsonb not null,
  admin_note text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_order_number_idx on public.orders (order_number);

alter table public.orders enable row level security;

drop policy if exists "Customers can create quote requests" on public.orders;
create policy "Customers can create quote requests"
on public.orders
for insert
to anon
with check (
  status = 'new'
  and final_price is null
  and admin_note is null
  and file_path like order_number || '/%'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-stl', 'quote-stl', false, 104857600, array['model/stl', 'application/sla'])
on conflict (id) do update
set public = false,
    file_size_limit = 104857600,
    allowed_mime_types = array['model/stl', 'application/sla'];

drop policy if exists "Customers can upload quote STL files" on storage.objects;
create policy "Customers can upload quote STL files"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'quote-stl'
  and lower(name) like '3dp-%/%.stl'
);
