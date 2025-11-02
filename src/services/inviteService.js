import { db } from '../firebase/config';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function generateInviteCode(familyId, createdBy, role = 'child') {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const inviteRef = await addDoc(collection(db, 'invites'), {
    code,
    familyId,
    createdBy,
    role,
    used: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });
  return { id: inviteRef.id, code };
}

export async function validateInviteCode(code) {
  try {
    console.log('Проверка кода:', code);
    const invitesRef = collection(db, 'invites');
    const snapshot = await getDocs(invitesRef);
    console.log('Найдено приглашений:', snapshot.size);
    
    for (const docSnap of snapshot.docs) {
      const invite = docSnap.data();
      console.log('Проверяем приглашение:', invite);
      if (invite.code === code && !invite.used) {
        const expiresAt = new Date(invite.expiresAt);
        if (expiresAt > new Date()) {
          console.log('Код валиден!');
          return { id: docSnap.id, ...invite };
        } else {
          console.log('Код истёк');
        }
      }
    }
    console.log('Код не найден');
    return null;
  } catch (error) {
    console.error('Ошибка validateInviteCode:', error);
    return null;
  }
}

export async function useInviteCode(inviteId) {
  const inviteRef = doc(db, 'invites', inviteId);
  await updateDoc(inviteRef, { used: true, usedAt: new Date().toISOString() });
}

export async function deleteInviteCode(inviteId) {
  await deleteDoc(doc(db, 'invites', inviteId));
}
