-- Create the table
create table todos (
  id bigint primary key generated always as identity,
  content text not null,
  completed boolean default false
);
-- Insert some sample data into the table
insert into todos (content)
values
  ('牛乳を買う'),
  ('チェロを弾く'),
  ('洗車する');
alter table todos enable row level security;

create policy "public can read todos"
on public.todos
for select to anon
using (true);

create policy "public can insert todos"
on "public"."todos"
for insert to anon
with check (true);

create policy "public can update todos"
on "public"."todos"
for update to anon
with check (true);
