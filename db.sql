-- Create the table
create table todos (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) default auth.uid(),
  content text not null,
  completed boolean default false
);

alter table todos enable row level security;

create policy "public can read todos"
on "public"."todos"
for select to authenticated
using ( (select auth.uid()) = user_id );

create policy "public can insert todos"
on "public"."todos"
for insert to authenticated
with check ( (select auth.uid()) = user_id );

create policy "public can update todos"
on "public"."todos"
for update to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );