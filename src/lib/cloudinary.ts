export const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dnvapprxh/upload';
export const CLOUDINARY_UPLOAD_PRESET = 'pln-magang-unsigned';

export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url || null;
}
