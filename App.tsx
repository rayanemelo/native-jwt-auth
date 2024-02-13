import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { AuthProvider } from './app/context/AuthContext';
import { Navigation } from './app/navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

