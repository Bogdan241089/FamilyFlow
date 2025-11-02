import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const CHALLENGES = [
  {
    id: 'daily_3',
    name: 'Ежедневный марафон',
    desc: 'Выполните 3 задачи сегодня',
    icon: '🎯',
    reward: 50,
    duration: 'daily',
    requirement: 3
  },
  {
    id: 'weekly_10',
    name: 'Недельный спринт',
    desc: 'Выполните 10 задач за неделю',
    icon: '🏃',
    reward: 200,
    duration: 'weekly',
    requirement: 10
  },
  {
    id: 'family_challenge',
    name: 'Семейный вызов',
    desc: 'Вся семья выполнит по 5 задач',
    icon: '👨‍👩‍👧‍👦',
    reward: 500,
    duration: 'weekly',
    requirement: 5
  },
  {
    id: 'speed_challenge',
    name: 'Скоростной вызов',
    desc: 'Выполните задачу за 1 час',
    icon: '⚡',
    reward: 100,
    duration: 'daily',
    requirement: 1
  }
];

export async function getActiveChallenges(familyId) {
  const challengesSnap = await getDocs(
    query(collection(db, `families/${familyId}/challenges`), where('active', '==', true))
  );
  
  return challengesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createChallenge(familyId, challengeType) {
  const challenge = CHALLENGES.find(c => c.id === challengeType);
  if (!challenge) return null;

  const challengeRef = await addDoc(collection(db, `families/${familyId}/challenges`), {
    ...challenge,
    active: true,
    progress: 0,
    participants: [],
    createdAt: new Date().toISOString(),
    expiresAt: getExpiryDate(challenge.duration)
  });

  return { id: challengeRef.id, ...challenge };
}

export async function updateChallengeProgress(familyId, challengeId, userId, progress) {
  const challengeRef = doc(db, `families/${familyId}/challenges`, challengeId);
  await updateDoc(challengeRef, {
    progress,
    [`participants.${userId}`]: progress
  });
}

export async function completeChallenge(familyId, challengeId, userId) {
  const challengeRef = doc(db, `families/${familyId}/challenges`, challengeId);
  await updateDoc(challengeRef, {
    active: false,
    completedBy: userId,
    completedAt: new Date().toISOString()
  });
}

function getExpiryDate(duration) {
  const now = new Date();
  if (duration === 'daily') {
    now.setHours(23, 59, 59, 999);
  } else if (duration === 'weekly') {
    now.setDate(now.getDate() + 7);
  }
  return now.toISOString();
}

export { CHALLENGES };
