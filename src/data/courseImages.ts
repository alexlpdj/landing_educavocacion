import type { ImageMetadata } from 'astro';

// Cada imagen de curso vive en src/assets/cursos/ y se nombra igual que el
// slug del curso. Así el mapa slug -> imagen se construye automáticamente.
const imagenes = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/cursos/*.webp',
  { eager: true },
);

export const courseImageMap: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(imagenes)) {
  const slug = path.split('/').pop()!.replace(/\.webp$/, '');
  courseImageMap[slug] = mod.default;
}
