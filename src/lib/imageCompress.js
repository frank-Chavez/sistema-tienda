// Convierte una foto (de la cámara o la galería) en una imagen pequeña
// lista para guardar en Firestore junto al producto.
//
// Las fotos del celular pesan 3–8 MB; Firestore acepta como máximo 1 MB por
// documento. Aquí se reduce a 900 px de lado y se comprime hasta ~250 KB,
// suficiente para verse bien en la tienda y cargar rápido.

const MAX_SIDE = 900;
const MAX_BYTES = 250 * 1024;

function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.ceil((base64.length * 3) / 4);
}

async function loadImage(file) {
  // createImageBitmap respeta la orientación de la foto (EXIF) en navegadores modernos.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* sigue con el método clásico */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });
}

/**
 * @param {File} file
 * @returns {Promise<string>} data URL (image/webp o image/jpeg)
 */
export async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen');
  }

  const img = await loadImage(file);
  const width = img.width;
  const height = img.height;
  let scale = Math.min(1, MAX_SIDE / Math.max(width, height));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Prueba WebP; si el navegador no lo soporta (devuelve PNG), usa JPEG.
  const probe = document.createElement('canvas');
  probe.width = probe.height = 1;
  const type = probe.toDataURL('image/webp').startsWith('data:image/webp')
    ? 'image/webp'
    : 'image/jpeg';

  let result = '';
  for (let attempt = 0; attempt < 6; attempt++) {
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.fillStyle = '#ffffff'; // fondo blanco para PNG transparentes en JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const quality = Math.max(0.5, 0.82 - attempt * 0.08);
    result = canvas.toDataURL(type, quality);
    if (dataUrlBytes(result) <= MAX_BYTES) break;
    scale *= 0.85;
  }

  if (typeof img.close === 'function') img.close();

  if (dataUrlBytes(result) > 700 * 1024) {
    throw new Error('La foto sigue siendo muy pesada. Prueba con otra.');
  }
  return result;
}

export function isDataImage(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}
