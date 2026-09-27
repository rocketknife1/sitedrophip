/** Image loader for the static GitHub Pages preview: serves the original file under the base path. */
export default function staticImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // The width query is ignored by the static host but keeps each srcset entry distinct.
  return `${src.startsWith("/") ? base : ""}${src}?w=${width}`;
}
