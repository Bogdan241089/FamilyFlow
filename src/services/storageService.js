import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export async function uploadAvatar(userId, file) {
  const avatarRef = ref(storage, `avatars/${userId}`);
  await uploadBytes(avatarRef, file);
  return await getDownloadURL(avatarRef);
}

export async function uploadTaskPhoto(familyId, taskId, file) {
  const photoRef = ref(storage, `families/${familyId}/tasks/${taskId}/${Date.now()}_${file.name}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}

export async function deletePhoto(photoUrl) {
  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    console.error('Ошибка удаления фото:', error);
  }
}

export function getAvatarUrl(userId) {
  if (!userId) return null;
  return `https://ui-avatars.com/api/?name=${userId}&background=random&size=128`;
}
