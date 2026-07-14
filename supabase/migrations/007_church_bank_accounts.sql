-- Align payment_method check with supported church bank names in the app

alter table public.donations
  drop constraint if exists donations_payment_method_check;

alter table public.donations
  add constraint donations_payment_method_check
  check (
    payment_method = any (
      array[
        'Telebirr'::text,
        'Commercial Bank of Ethiopia'::text,
        'Development Bank of Ethiopia'::text,
        'Awash Bank'::text,
        'Bank of Abyssinia'::text,
        'Dashen Bank'::text,
        'Wegagen Bank'::text,
        'Hibret Bank'::text,
        'Nib International Bank'::text,
        'Cooperative Bank of Oromia'::text,
        'Oromia Bank'::text,
        'Lion International Bank'::text,
        'Zemen Bank'::text,
        'Enat Bank'::text,
        'Berhan Bank'::text,
        'Bunna Bank'::text,
        'Abay Bank'::text,
        'Addis International Bank'::text,
        'Global Bank Ethiopia'::text,
        'Tsehay Bank'::text,
        'Hijra Bank'::text,
        'ZamZam Bank'::text,
        'Ahadu Bank'::text,
        'Siinqee Bank'::text,
        'Gadaa Bank'::text,
        'Amhara Bank'::text,
        'Omo Bank'::text,
        'Sidama Bank'::text,
        'Rammis Bank'::text,
        'Siket Bank'::text,
        'Shabelle Bank'::text,
        'Tsedey Bank'::text,
        'Goh Betoch Bank'::text
      ]
    )
  );
