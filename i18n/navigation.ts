import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// ÚNICO punto de importación de Link/router en todo el proyecto.
// Cualquier componente que necesite navegar importa desde aquí,
// NUNCA desde 'next/link' o 'next/navigation' directamente — así
// el locale activo se preserva automáticamente sin que ningún
// componente tenga que concatenar '/en' o '/es' a mano.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
