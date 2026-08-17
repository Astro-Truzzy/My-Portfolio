import dynamic from "next/dynamic";
import { contactCopy, site, socials } from "@/lib/content";
import { Faq } from "@/components/faq";
import { SectionLabel } from "@/components/section-label";

const ContactForm = dynamic(() =>
  import("@/components/contact-form").then((m) => m.ContactForm),
);

type StackedLink = {
  label: string;
  href: string;
  value: string;
  placeholder?: boolean;
  download?: string;
};

const stacked: StackedLink[] = [
  { label: "Email", href: `mailto:${site.email}`, value: site.email },
  ...socials
    .filter((s) => s.label !== "Email")
    .map((s) => ({
      label: s.label,
      href: s.href,
      value: s.href.startsWith("http")
        ? s.href.replace(/^https?:\/\//, "")
        : s.label,
      placeholder: s.placeholder,
    })),
  {
    label: "Résumé",
    href: site.resumeHref,
    value: "Download CV",
    download: site.resumeFilename,
  },
  {
    label: "Phone",
    href: `tel:${site.phone.replace(/\s/g, "")}`,
    value: site.phone,
  },
];

export function Contact() {
  return (
    <section id="contact" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="06" title="Contact" />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="font-sans text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] tracking-tighter text-ink">
              {contactCopy.headline}
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              {contactCopy.ask}
            </p>

            <ul className="mt-12 space-y-5">
              {stacked.map((item) => (
                <li key={item.label} className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
                    {item.label}
                  </span>
                  {item.placeholder || !item.href ? (
                    <span className="text-ink-faint">
                      {/* [add URL in lib/content.ts] */}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      {...(item.download ? { download: item.download } : {})}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-xl text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {item.value}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>

        <Faq />
      </div>
    </section>
  );
}
