
export async function fetchIcon(url: string): Promise<string> {
  if (!url) return '';

  try {
    // Asegurar que la URL tenga protocolo
    const baseUrl = url.startsWith('http') ? url : `https://${url}`;
    const origin = new URL(baseUrl).origin;

    // 1. Intentar cargar el manifest.json
    try {
      const manifestData = await findManifest(baseUrl);
      if (manifestData && manifestData.icons && Array.isArray(manifestData.icons)) {
        const icon = selectBestManifestIcon(manifestData.icons, manifestData.url);
        if (icon) return icon;
      }
    } catch (e) {
      console.warn('Error fetching manifest:', e);
    }

    // 2. Orden de rutas alternativas (A-E)
    const fallbackPaths = [
      '/manifest-icon-192.maskable.png',
      '/img/logo-dark.svg',
      '/favicon.ico',
      '/logo.png',
      '/assets/logo.png'
    ];

    for (const path of fallbackPaths) {
      const fullPath = `${origin}${path}`;
      if (await isValidImage(fullPath)) {
        return fullPath;
      }
    }

    // 3. Meta tags del HTML (F)
    try {
      const htmlResponse = await fetch(baseUrl);
      if (htmlResponse.ok) {
        const htmlText = await htmlResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const metaIcon = 
          doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
          doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
          doc.querySelector('link[rel="icon"]')?.getAttribute('href');

        if (metaIcon) {
          const fullMetaIcon = metaIcon.startsWith('http') ? metaIcon : new URL(metaIcon, origin).href;
          if (await isValidImage(fullMetaIcon)) {
            return fullMetaIcon;
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing HTML for icons:', e);
    }

    // 4. Último recurso: Google Favicon Service (VALIDADO)
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=128`;
    if (await isValidImage(googleFavicon)) {
      return googleFavicon;
    }

  } catch (e) {
    console.error('Error in fetchIcon:', e);
  }

  // Si nada funciona, devolver vacío para usar el placeholder local
  return '';
}

async function findManifest(baseUrl: string): Promise<{ icons: any[], url: string } | null> {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) throw new Error('Failed to fetch base URL');
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const manifestLink = doc.querySelector('link[rel="manifest"]')?.getAttribute('href') || 
                         doc.querySelector('link[rel="web-app-manifest"]')?.getAttribute('href');
    
    const manifestUrl = manifestLink 
      ? (manifestLink.startsWith('http') ? manifestLink : new URL(manifestLink, baseUrl).href)
      : new URL('/manifest.json', baseUrl).href;

    const manifestRes = await fetch(manifestUrl);
    if (manifestRes.ok) {
      const json = await manifestRes.json();
      return { icons: json.icons, url: manifestUrl };
    }
  } catch (e) {
    // Intentar ruta por defecto
    try {
      const defaultUrl = new URL('/manifest.json', baseUrl).href;
      const res = await fetch(defaultUrl);
      if (res.ok) {
        const json = await res.json();
        return { icons: json.icons, url: defaultUrl };
      }
    } catch (e) {}
  }
  return null;
}

function selectBestManifestIcon(icons: any[], manifestUrl: string): string | null {
  // 1. Prioridad: maskable + mayor tamaño
  const maskableIcons = icons
    .filter(icon => icon.purpose?.includes('maskable'))
    .sort((a, b) => parseSize(b.sizes) - parseSize(a.sizes));

  if (maskableIcons.length > 0) {
    return normalizeUrl(maskableIcons[0].src, manifestUrl);
  }

  // 2. Prioridad: any + mayor tamaño
  const anyIcons = icons
    .filter(icon => !icon.purpose || icon.purpose.includes('any'))
    .sort((a, b) => parseSize(b.sizes) - parseSize(a.sizes));

  if (anyIcons.length > 0) {
    return normalizeUrl(anyIcons[0].src, manifestUrl);
  }

  return null;
}

function parseSize(sizeStr: string): number {
  if (!sizeStr) return 0;
  // Puede ser "192x192" o "192x192 512x512"
  const sizes = sizeStr.split(' ');
  let maxSize = 0;
  for (const s of sizes) {
    const width = parseInt(s.split('x')[0]);
    if (!isNaN(width) && width > maxSize) maxSize = width;
  }
  return maxSize;
}

function normalizeUrl(src: string, baseUrl: string): string {
  try {
    return new URL(src, baseUrl).href;
  } catch (e) {
    return src;
  }
}

async function isValidImage(url: string): Promise<boolean> {
  try {
    // Intentar primero con HEAD para ahorrar ancho de banda
    let response = await fetch(url, { method: 'HEAD' });
    
    // Si el servidor no permite HEAD, intentar con GET pero limitado
    if (response.status === 405 || response.status === 403 || response.status === 401) {
      response = await fetch(url, { method: 'GET' });
    }

    if (!response.ok) return false;

    const contentType = response.headers.get('content-type');
    const contentLength = parseInt(response.headers.get('content-length') || '0');

    // Verificar que sea una imagen y que no sea un archivo vacío o sospechosamente pequeño
    // Algunos servicios devuelven un placeholder de 1x1 si no encuentran el icono
    const isValidType = !!contentType?.startsWith('image/');
    const isNotTooSmall = contentLength === 0 || contentLength > 100; // Si no hay length, confiamos en el tipo

    return isValidType && isNotTooSmall;
  } catch (e) {
    return false;
  }
}
