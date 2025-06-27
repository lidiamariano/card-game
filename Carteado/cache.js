import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CACHE_KEY = 'CARTAS_CACHE';
const CACHE_EXPIRATION_DAYS = 7; // Dias para expirar o cache

export const getCachedImage = async (code) => {
  try {
    // Verifica se existe no cache
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const { cartas, timestamp } = JSON.parse(cachedData);
    
    // Verifica se o cache expirou
    const isExpired = (Date.now() - timestamp) > (CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    if (isExpired) return null;

    return cartas[code] || null;
  } catch (error) {
    console.error('Erro ao buscar carta no cache:', error);
    return null;
  }
};

export const cacheAllCards = async () => {
  try {
    // Verifica se já temos cache recente
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { timestamp } = JSON.parse(cachedData);
      const isExpired = (Date.now() - timestamp) > (CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
      if (!isExpired) return;
    }

    console.log('Baixando e armazenando cartas em cache...');
    
    // Lista de todas as cartas (simplificado - na prática você precisaria de todas as 52)
    const todasCartas = [
      'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH',
      'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD',
      // Adicione todas as outras cartas...
    ];

    const cartasCache = {};
    
    // Baixa cada carta e salva no sistema de arquivos
    for (const code of todasCartas) {
      const uri = `https://deckofcardsapi.com/static/img/${code}.png`;
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + code + '.png',
        {}
      );
      
      try {
        const { uri: localUri } = await downloadResumable.downloadAsync();
        cartasCache[code] = localUri;
      } catch (error) {
        console.error(`Erro ao baixar carta ${code}:`, error);
      }
    }

    // Salva o verso também
    const backUri = `https://deckofcardsapi.com/static/img/back.png`;
    const backDownload = FileSystem.createDownloadResumable(
      backUri,
      FileSystem.documentDirectory + 'BACK.png',
      {}
    );
    const { uri: localBackUri } = await backDownload.downloadAsync();
    cartasCache['BACK'] = localBackUri;

    // Salva no AsyncStorage
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
      cartas: cartasCache,
      timestamp: Date.now()
    }));

    console.log('Cache de cartas atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar cache de cartas:', error);
  }
};