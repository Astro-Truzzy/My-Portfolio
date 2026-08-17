export function SectionLabel({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <p className="mb-8 flex items-baseline gap-3 font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
      <span className="text-accent">{index}</span>
      <span aria-hidden="true">/</span>
      <span>{title}</span>
    </p>
  );
}
