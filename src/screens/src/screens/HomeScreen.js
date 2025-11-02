import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const HomeScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Навигация вернется на WelcomeScreen автоматически
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать в FamilyFlow! 🏠</Text>
      
      {user && (
        <Text style={styles.userInfo}>
          Вы вошли как: {user.email}
        </Text>
      )}

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📅</Text>
          <Text style={styles.menuText}>Календарь</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>✅</Text>
          <Text style={styles.menuText}>Задачи</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.menuText}>Члены семьи</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🛒</Text>
          <Text style={styles.menuText}>Списки покупок</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 40,
  },
  menu: {
    width: '100%',
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;