import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';

export async function createFamily(userId, familyName) {
  const familyRef = doc(collection(db, 'families'));
  const familyId = familyRef.id;
  
  await setDoc(familyRef, {
    name: familyName,
    createdBy: userId,
    createdAt: serverTimestamp()
  });
  
  await setDoc(doc(db, `families/${familyId}/members`, userId), {
    role: 'parent',
    joinedAt: serverTimestamp()
  });
  
  await setDoc(doc(db, 'users', userId), {
    defaultFamilyId: familyId
  }, { merge: true });
  
  return familyId;
}

export async function getFamily(familyId) {
  const snap = await getDoc(doc(db, 'families', familyId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getFamilyMembers(familyId) {
  const membersSnap = await getDocs(collection(db, `families/${familyId}/members`));
  const members = [];
  for (const memberDoc of membersSnap.docs) {
    const userSnap = await getDoc(doc(db, 'users', memberDoc.id));
    members.push({
      id: memberDoc.id,
      ...memberDoc.data(),
      ...userSnap.data()
    });
  }
  return members;
}

export async function sendInvite(familyId, email, invitedBy) {
  const inviteRef = await addDoc(collection(db, 'invites'), {
    familyId,
    email: email.toLowerCase(),
    invitedBy,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return inviteRef.id;
}

export async function getInvites(email) {
  const q = query(
    collection(db, 'invites'),
    where('email', '==', email.toLowerCase()),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  const invites = [];
  for (const inviteDoc of snap.docs) {
    const family = await getFamily(inviteDoc.data().familyId);
    invites.push({
      id: inviteDoc.id,
      ...inviteDoc.data(),
      familyName: family?.name
    });
  }
  return invites;
}

export async function acceptInvite(inviteId, userId) {
  const inviteSnap = await getDoc(doc(db, 'invites', inviteId));
  if (!inviteSnap.exists()) throw new Error('Приглашение не найдено');
  
  const invite = inviteSnap.data();
  const familyId = invite.familyId;
  
  await setDoc(doc(db, `families/${familyId}/members`, userId), {
    role: 'child',
    joinedAt: serverTimestamp()
  });
  
  await setDoc(doc(db, 'users', userId), {
    defaultFamilyId: familyId
  }, { merge: true });
  
  await setDoc(doc(db, 'invites', inviteId), {
    status: 'accepted'
  }, { merge: true });
  
  return familyId;
}

export async function rejectInvite(inviteId) {
  await setDoc(doc(db, 'invites', inviteId), {
    status: 'rejected'
  }, { merge: true });
}
