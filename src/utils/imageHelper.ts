/**
 * imageHelper.ts
 * 
 * Gère la résolution des URLs images :
 * - Images locales : /images/nom-fichier.jpg → /images/nom-fichier.jpg
 * - URLs distantes : https://... → https://...
 * - Chemins API : /api/images/123 → /api/images/123
 * 
 * Encode les caractères spéciaux (accents, espaces) pour les chemins locaux
 */

export function getImageSrc(url?: string): string {
  // Si pas d'URL, retourner string vide
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  // Si c'est déjà une URL distante (http/https), la retourner telle quelle
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // Si c'est un chemin local (/images/...), encoder les parties
  if (trimmedUrl.startsWith('/')) {
    const parts = trimmedUrl.split('/').map((part, index) => {
      // Ne pas encoder le premier élément vide (du split initial)
      return index === 0 ? part : encodeURIComponent(part);
    });
    return parts.join('/');
  }
  
  // Sinon, traiter comme chemin local relatif
  return encodeURIComponent(trimmedUrl);
}

/**
 * Variante alternative si vous avez besoin de décoder une URL pour l'affichage
 * (par exemple, pour les logs ou les titres)
 */
export function decodeImagePath(encodedUrl: string): string {
  if (!encodedUrl) return '';
  try {
    const parts = encodedUrl.split('/');
    return parts.map(decodeURIComponent).join('/');
  } catch {
    return encodedUrl;
  }
}

/**
 * Construit un chemin d'image complet avec domaine (utile pour le SSR, partage, etc.)
 */
export function getFullImageUrl(
  relativePath?: string,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
): string {
  if (!relativePath) return '';
  
  const imageSrc = getImageSrc(relativePath);
  
  // Si c'est déjà une URL absolue, la retourner
  if (imageSrc.startsWith('http')) {
    return imageSrc;
  }
  
  // Sinon, construire l'URL complète
  return `${baseUrl}${imageSrc}`;
}

