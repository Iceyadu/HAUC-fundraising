-- Donation flow: receipt storage path, status tracking, and storage bucket

alter table public.donations
  add column if not exists receipt_path text,
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected'));

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

create policy "Anyone can upload receipts"
  on storage.objects
  for insert
  with check (bucket_id = 'receipts');

create policy "Authenticated users can view receipts"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'receipts');

create policy "Authenticated users can delete receipts"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'receipts');
