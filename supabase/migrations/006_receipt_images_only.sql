-- Restrict receipt uploads to images only (2 MB enforced in application code)

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png']
where id = 'receipts';
