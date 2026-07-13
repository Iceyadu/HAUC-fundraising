-- Fix receipt uploads: ensure bucket exists and public insert policy

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload receipts" on storage.objects;

create policy "Anyone can upload receipts"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'receipts');
