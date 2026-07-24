// Formateadores puros — sin React, sin I/O. Fáciles de testear.

// Locale único para toda la app. Cambiar acá propaga a todos los números
// formateados. es-AR = "1.234" (punto como separador de miles), en-US =
// "1,234" (coma). El spec deja a elección; usamos en-US por consistencia
// con el resto del código.
const LOCALE = "en-US";

export function formatNumber(n: number): string {
  return new Intl.NumberFormat(LOCALE).format(n);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
