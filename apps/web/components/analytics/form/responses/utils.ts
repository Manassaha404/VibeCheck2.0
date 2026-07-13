import { FormResponseAnswer } from "@repo/services/form/model";

export function formatValue(value: unknown, type: string): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return (value as string[]).join(", ");
  if (type === "date") {
    try {
      return new Date(String(value)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getPreviewText(answers: FormResponseAnswer[]): string {
  // Show first non-primary text answer as preview
  const firstText = answers.find(
    (a) =>
      !a.isPrimary &&
      (a.fieldType === "short_text" ||
        a.fieldType === "long_text" ||
        a.fieldType === "email" ||
        a.fieldType === "number") &&
      a.value,
  );
  if (firstText) {
    const val = String(firstText.value);
    return val.length > 80 ? val.slice(0, 80) + "…" : val;
  }

  // Fall back to any answer
  const any = answers.find((a) => !a.isPrimary && a.value != null);
  if (any) {
    const val = Array.isArray(any.value)
      ? (any.value as string[]).join(", ")
      : String(any.value);
    return val.length > 80 ? val.slice(0, 80) + "…" : val;
  }

  return "—";
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
