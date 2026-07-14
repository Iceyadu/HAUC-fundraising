-- Restrict payment_method to official church bank accounts only

alter table public.donations
  drop constraint if exists donations_payment_method_check;

alter table public.donations
  add constraint donations_payment_method_check
  check (
    payment_method = any (
      array[
        'Bank of Abyssinia: 1315 (Ref: 132532397)'::text,
        'Awash Bank: 01352574197600'::text,
        'Commercial Bank of Ethiopia (CBE): 1000336186211'::text,
        'Commercial Bank of Ethiopia (CBE): 1315'::text,
        'Berhan Bank: 2600260017823 (Ref: 5212)'::text,
        'Cooperative Bank of Oromia: 1059900033212'::text,
        'Cooperative Bank of Oromia: 7776'::text
      ]
    )
  );
