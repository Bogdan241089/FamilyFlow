import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Create a family document and add the owner to members subcollection.
 * Returns the new familyId.
 *
 * @param {import('firebase/firestore').Firestore} db
 * @param {{name: string, ownerId: string}} data
 */
export async function createFamily(db, data) {
  const familiesRef = collection(db, 'families');
  const familyDocRef = await addDoc(familiesRef, {
    name: data.name,
    ownerId: data.ownerId,
    createdAt: serverTimestamp()
  });

  // add member record
  const memberRef = doc(db, `families/${familyDocRef.id}/members`, data.ownerId);
  await setDoc(memberRef, {
    role: 'parent',
    joinedAt: serverTimestamp(),
    color: '#4CAF50'
  });

  return familyDocRef.id;
}

// Future helper functions: addTask, getTasksForUser, inviteMember, etc.
