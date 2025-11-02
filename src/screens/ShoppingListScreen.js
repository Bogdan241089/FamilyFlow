import React, { useState, useEffect } from 'react';
import './ShoppingListScreen.css';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import Spinner from '../components/Spinner';

function ShoppingListScreen() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          const familyId = profile?.defaultFamilyId;
          if (familyId) {
            const itemsSnap = await getDocs(collection(db, `families/${familyId}/shopping`));
            const itemsList = [];
            itemsSnap.forEach(doc => {
              itemsList.push({ id: doc.id, ...doc.data() });
            });
            setItems(itemsList);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setToast({ message: 'Ошибка загрузки данных', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [currentUser]);

  async function handleAddItem(e) {
    e.preventDefault();
    if (!name) {
      setToast({ message: 'Введите название товара', type: 'error' });
      return;
    }
    if (!currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      const newItem = { name, qty, bought: false, createdAt: new Date().toISOString() };
      await addDoc(collection(db, `families/${familyId}/shopping`), newItem);
      const itemsSnap = await getDocs(collection(db, `families/${familyId}/shopping`));
      const itemsList = [];
      itemsSnap.forEach(doc => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
      setName('');
      setQty('');
      setToast({ message: 'Товар добавлен', type: 'success' });
    } catch (error) {
      console.error('Ошибка добавления:', error);
      setToast({ message: 'Ошибка добавления товара', type: 'error' });
    }
  }

  async function handleToggleBought(item) {
    if (!currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      await updateDoc(doc(db, `families/${familyId}/shopping`, item.id), { bought: !item.bought });
      const itemsSnap = await getDocs(collection(db, `families/${familyId}/shopping`));
      const itemsList = [];
      itemsSnap.forEach(doc => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      setToast({ message: 'Ошибка обновления', type: 'error' });
    }
  }

  async function handleDelete(item) {
    if (!currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      await deleteDoc(doc(db, `families/${familyId}/shopping`, item.id));
      const itemsSnap = await getDocs(collection(db, `families/${familyId}/shopping`));
      const itemsList = [];
      itemsSnap.forEach(doc => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
      setToast({ message: 'Товар удалён', type: 'success' });
    } catch (error) {
      console.error('Ошибка удаления:', error);
      setToast({ message: 'Ошибка удаления', type: 'error' });
    }
  }

  if (loading) return <div className="shopping-container"><Spinner /></div>;

  return (
    <div className="shopping-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
  <h2><FaShoppingCart style={{ marginRight: '0.5rem', color: '#4caf50' }}/> Список покупок</h2>
      <form onSubmit={handleAddItem} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Название товара"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Количество"
          value={qty}
          onChange={e => setQty(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px' }}>
          Добавить
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.length === 0 && <li>Нет покупок</li>}
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '1rem', background: '#f7f8fa', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: item.bought ? 'line-through' : 'none', opacity: item.bought ? 0.6 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input type="checkbox" checked={!!item.bought} onChange={() => handleToggleBought(item)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <div>
                <strong>{item.name}</strong> {item.qty && <span>— {item.qty}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(item)} style={{ padding: '0.3rem 0.7rem', background: '#f44336', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingListScreen;
