import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function generateExcerpt(content: string, maxLength: number = 150): string {
  const text = extractTextFromHtml(content);
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...'
    : text;
}
