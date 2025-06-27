import 'react-native-gesture-handler';
import React, { useEffect } from 'react'; // Importe o useEffect aqui
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './views/Inicio';
import Jogo from './views/Jogo';
import Resultado from './views/Resultado';
import { cacheAllCards } from './cache'; // Ajuste o caminho conforme sua estrutura
import Historico from './views/Historico';

const Stack = createStackNavigator();

export default function App() {
  // Mova o useEffect para dentro do componente
  useEffect(() => {
    const initializeCache = async () => {
      try {
        console.log('Iniciando cache de cartas...');
        await cacheAllCards();
        console.log('Cache de cartas pronto!');
      } catch (error) {
        console.error('Erro ao inicializar cache:', error);
      }
    };

    initializeCache();
  }, []); // Array vazio para executar apenas uma vez

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E7D32', // Cor verde escuro
          },
          headerTintColor: '#fff', // Cor do texto do header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Inicio" 
          component={Inicio} 
          options={{ title: 'Início' }} 
        />
        <Stack.Screen 
          name="Jogo" 
          component={Jogo} 
          options={{ title: 'Jogo de Cartas' }} 
        />
        <Stack.Screen 
          name="Resultado" 
          component={Resultado} 
          options={{ title: 'Resultado' }} 
        />
        <Stack.Screen 
        name="Historico" 
        component={Historico} 
        options={{title: 'Historico'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos globais (opcional)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // Cor verde
  },
});