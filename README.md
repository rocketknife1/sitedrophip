# Northdesk: magazin dropshipping (UE)

Next.js 16 + Tailwind + Stripe Checkout + Resend. Fără bază de date: produsele stau în cod, comenzile în Stripe.

## Pornire locală

```bash
npm install
cp .env.example .env.local   # completează cheile (vezi mai jos)
npm run dev                  # http://localhost:3000
```

Site-ul merge și fără chei: poți naviga și adăuga în coș. Checkout-ul și formularele îți spun clar ce cheie lipsește.

## Preview online (GitHub Pages)

**https://rocketknife1.github.io/sitedrophip/** se actualizează singur la fiecare `git push` pe `main` (vezi tab-ul *Actions* pe GitHub).

E o versiune statică: vitrina, coșul și paginile merg, dar **plata și formularele sunt oprite** (GitHub Pages nu are server). Pentru magazinul complet, cu Stripe și emailuri, site-ul trebuie pus pe Vercel sau pe alt host cu Node.js.

## Unde schimbi ce

| Ce | Fișier |
| --- | --- |
| Numele magazinului, datele firmei, livrare, retur | `src/data/site.ts` |
| Produse, prețuri, variante, texte | `src/data/products.ts` |
| SKU și cost de la furnizor (secret, doar pe server) | `src/data/supplier.ts` |
| Poze produse | `public/images/products/` (JPG/WebP, min. 1400 px). Acum sunt poze demo de pe Unsplash, vezi `public/images/CREDITS.md` |
| Texte legale | `src/content/legal.tsx` |
| Culori | `src/app/globals.css` (`--forest`, `--note`, …) |

**Adaugi un produs:** copiezi un obiect în `products.ts`, îi dai `slug` și `id`-uri de variante unice, pui pozele în `public/images/products/`, apoi adaugi fiecare variantă în `supplier.ts`. Dacă uiți o variantă în `supplier.ts`, build-ul se oprește cu un mesaj clar. Așa nu poți vinde ceva ce nu știi de unde comanzi.

## Chei (toate gratuite la început)

1. **Stripe** (dashboard.stripe.com): cont, apoi *Developers → API keys* → `STRIPE_SECRET_KEY` (`sk_test_…`).
2. **Webhook local:** instalezi Stripe CLI și rulezi
   `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Secretul afișat (`whsec_…`) merge în `STRIPE_WEBHOOK_SECRET`.
3. **Resend** (resend.com): `RESEND_API_KEY`. Până îți verifici domeniul, lași `EMAIL_FROM` pe `onboarding@resend.dev` și pui la `ORDER_NOTIFY_EMAIL` adresa contului tău Resend.
4. **Test de comandă:** cardul `4242 4242 4242 4242`, orice dată din viitor, orice CVC. Primești două emailuri: confirmarea pentru client și notificarea pentru tine, cu SKU-ul de la furnizor.

## Cum procesezi o comandă (manual, la început)

1. Primești emailul „New order to fulfil”, cu produsele, SKU-urile, marja și adresa.
2. Plasezi comanda la furnizor cu adresa clientului.
3. Trimiți clientului linkul de tracking (răspunzi direct la email).
4. Orice retur sau rambursare o faci din Stripe Dashboard → Payments → Refund.

## Înainte de lansare (obligatoriu)

- [ ] Firmă (PFA/SRL) și datele ei completate în `site.ts`. Fără firmă nu vinzi legal și Stripe nu-ți plătește banii.
- [ ] TVA: vorbește cu un contabil despre OSS (vânzări la distanță în UE peste 10.000 €/an) și e-Factura.
- [ ] Texte legale citite și verificate de cineva care se pricepe. Acum sunt șabloane.
- [ ] Produse reale și **poze de la furnizor**: pozele demo arată și produse ale altor branduri, deci nu pot rămâne la lansare.
- [ ] **Timpi de livrare reali** de la furnizor în `site.ts → shipping`. Tabelul „Why order from Northdesk” de pe prima pagină e adevărat doar dacă livrezi din UE.
- [ ] `shipsFrom` și `carrier` spun adevărul.
- [ ] Domeniu propriu, `NEXT_PUBLIC_SITE_URL` setat, domeniu verificat în Resend.
- [ ] Webhook creat în Stripe Dashboard spre `https://domeniul-tau/api/stripe/webhook` (evenimente: `checkout.session.completed`, `checkout.session.async_payment_succeeded`).
- [ ] Chei Stripe live **doar după** ce pui `NEXT_PUBLIC_DEMO_MODE=false`. Cât timp e în modul demo, site-ul refuză cheile live.
- [ ] Hosting cu uz comercial: Vercel Pro (20 $/lună) sau Cloudflare. Planul Vercel Hobby interzice uzul comercial.

## Ce lipsește intenționat (se adaugă când există vânzări)

Cont de client, bază de date, automatizarea comenzilor la furnizor prin API, mai multe limbi, Stripe Tax, reduceri. Fiecare poate fi adăugat fără rescrierea site-ului.
