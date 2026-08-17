export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function mailtoHref(to: string, name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Portfolio — note from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
