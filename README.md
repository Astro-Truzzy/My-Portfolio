# Trust Williams — Portfolio

Hire-ready single-page site for **Trust Williams**, full-stack developer and founder (Ridely, Ownbase). Content is taken from the professional CV in this folder. Edit facts in one file; do not invent employers, dates, or metrics.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Where to edit content

All résumé-backed copy lives in [`lib/content.ts`](lib/content.ts):

- Name, role, location, timezone, email, phone
- Hero, about, proof stats, capabilities
- Selected work (case studies)
- Experience, education, certifications
- Toolkit groups and FAQ
- Social URLs

The skills desk (orbiting pills) lives at [`/skills`](http://localhost:3000/skills). Names come from the résumé toolkit; icon slugs are in [`lib/skills.ts`](lib/skills.ts).

The CV PDF is served from [`public/Trust_Williams_Tech_CV.pdf`](public/Trust_Williams_Tech_CV.pdf) (header + contact download).

GitHub is [github.com/Astro-Truzzy](https://github.com/Astro-Truzzy). LinkedIn is still a placeholder until you send a URL. Project live/GitHub links for Ridely, Ownbase, BuyFirst, and Core Wealth Market are taken from that profile; VeluxLink has no public repo yet.

## Contact form

The form is real. It never claims success unless a provider accepted the message.

| Env var                | Purpose                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Send via [Resend](https://resend.com) (preferred)                                                                                                         |
| `RESEND_FROM`          | Verified from-address, e.g. `Portfolio <hello@yourdomain.com>`. Defaults to `onboarding@resend.dev` (sandbox: only delivers to your Resend account email) |
| `CONTACT_TO`           | Inbox. Defaults to `Taresy.dev@gmail.com`                                                                                                                 |
| `FORMSPREE_FORM_ID`    | Used if Resend is not set                                                                                                                                 |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO / OG (e.g. `https://your-domain.vercel.app`)                                                                                        |

Copy [`.env.example`](.env.example) to `.env.local`. If none of the mail keys are set, submit opens a `mailto:` draft instead — the UI says so.

## Deploy on Vercel

1. Push this folder to GitHub.
2. [Import the repo](https://vercel.com/new) — framework preset **Next.js**.
3. Add env vars from the table above.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to the production URL.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Resend (optional)

Theme preference is stored in `localStorage` (`theme` = `dark` | `light`). Default is dark.
#
