import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaWallet, FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import Spinner from '../components/Spinner';

function BudgetScreen() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  async function fetchTransactions() {
    try {
      if (currentUser) {
        const profile = await getProfile(currentUser.uid);
        const familyId = profile?.defaultFamilyId;
        if (familyId) {
          const transSnap = await getDocs(collection(db, `families/${familyId}/budget`));
          const transList = [];
          transSnap.forEach(doc => {
            transList.push({ id: doc.id, ...doc.data() });
          });
          setTransactions(transList.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setToast({ message: 'Ошибка загрузки данных', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!amount || !category) {
      setToast({ message: 'Заполните все поля', type: 'error' });
      return;
    }
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      
      await addDoc(collection(db, `families/${familyId}/budget`), {
        amount: parseFloat(amount),
        category,
        type,
        description,
        date: new Date().toISOString(),
        createdBy: currentUser.uid
      });
      
      await fetchTransactions();
      setAmount('');
      setCategory('');
      setDescription('');
      setToast({ message: 'Транзакция добавлена', type: 'success' });
    } catch (error) {
      console.error('Ошибка:', error);
      setToast({ message: 'Ошибка добавления', type: 'error' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Удалить транзакцию?')) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      
      await deleteDoc(doc(db, `families/${familyId}/budget`, id));
      await fetchTransactions();
      setToast({ message: 'Транзакция удалена', type: 'success' });
    } catch (error) {
      console.error('Ошибка:', error);
      setToast({ message: 'Ошибка удаления', type: 'error' });
    }
  }

  const balance = transactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h2><FaWallet style={{ marginRight: '0.5rem', color: '#4caf50' }}/> Семейный бюджет</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: balance >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Баланс</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: balance >= 0 ? '#4caf50' : '#f44336' }}>
            {balance.toFixed(2)} ₽
          </p>
        </div>
        <div style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Доходы</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2196f3' }}>
            +{totalIncome.toFixed(2)} ₽
          </p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Расходы</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff9800' }}>
            -{totalExpense.toFixed(2)} ₽
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option value="expense">💸 Расход</option>
            <option value="income">💰 Доход</option>
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Сумма" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Категория" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
        </div>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание (необязательно)" style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1rem' }} />
        <button type="submit" style={{ padding: '0.7rem 2rem', background: type === 'income' ? '#4caf50' : '#ff9800', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Добавить
        </button>
      </form>

      <h3>История транзакций</h3>
      <div>
        {transactions.length === 0 && <p>Нет транзакций</p>}
        {transactions.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', marginBottom: '0.5rem', background: '#fff', borderRadius: '8px', borderLeft: `4px solid ${t.type === 'income' ? '#4caf50' : '#ff9800'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {t.type === 'income' ? <FaArrowUp color="#4caf50" size={24} /> : <FaArrowDown color="#ff9800" size={24} />}
              <div>
                <strong>{t.category}</strong>
                {t.description && <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{t.description}</p>}
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>{new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: t.type === 'income' ? '#4caf50' : '#ff9800' }}>
                {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} ₽
              </span>
              <button onClick={() => handleDelete(t.id)} style={{ padding: '0.5rem', background: '#f44336', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetScreen;
