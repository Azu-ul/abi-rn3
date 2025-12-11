import HeaderReact from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() 
{
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [jugadores, setJugadores] = useState<any[]>([]);
  const [directores, setDirectores] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);

  useEffect(() => {
    (async() => {
      setMail(await AsyncStorage.getItem('email') as any || '');
    })();
    fetch('http://localhost:3031/getJugadores')
      .then(response => response.json())
      .then(data => setJugadores(data));
    fetch('http://localhost:3031/getDirectores')
      .then(response => response.json())
      .then(data => setDirectores(data));
    fetch('http://localhost:3031/getEquipos')
      .then(response => response.json())
      .then(data => setEquipos(data));
  }, [])

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <HeaderReact />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Bienvenido a FutbolApp</Text>
        <Text style={styles.heroSubtitle}>
          {mail ? `¡Hola ${mail}!` : 'Explora jugadores, equipos y directores técnicos'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚽ Jugadores Destacados</Text>
          <Text style={styles.sectionCount}>{jugadores.length} jugadores</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {jugadores.map((item) => (
            <Pressable
              key={item.id}
              style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                router.push({
                  pathname: "/profile",
                  params: { id: item.id, tipo: 1 },
                });
              }}>
              <Image
                style={styles.imagen}
                source={{ uri: 'http://localhost:3031' + item.imagen }}
              />
              <View style={styles.cardContent}>
                <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
                <Text style={styles.posicion}>{item.posicion}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.statBadge}>⚽ {item.goles} goles</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👔 Directores Técnicos</Text>
          <Text style={styles.sectionCount}>{directores.length} directores</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {directores.map((item) => (
            <Pressable
              key={item.id}
              style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                router.push({
                  pathname: "/profile",
                  params: { id: item.id, tipo: 2 },
                });
              }}>
              <Image
                style={styles.imagen}
                source={{ uri: 'http://localhost:3031' + item.imagen }}
              />
              <View style={styles.cardContent}>
                <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.statBadge}>🏆 {item.victorias} victorias</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏟️ Equipos</Text>
          <Text style={styles.sectionCount}>{equipos.length} equipos</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {equipos.map((item) => (
            <Pressable
              key={item.id}
              style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                router.push({
                  pathname: "/profile",
                  params: { id: item.id, tipo: 3 },
                });
              }}>
              <Image
                style={styles.imagen}
                source={{ uri: 'http://localhost:3031' + item.escudo }}
              />
              <View style={styles.cardContent}>
                <Text style={styles.nombre}>{item.nombre}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    paddingBottom: 30,
  },
  hero: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionCount: {
    fontSize: 14,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carousel: {
    paddingLeft: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{scale: 0.97}],
    opacity: 0.9,
  },
  imagen: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  nombre: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  posicion: {
    color: '#999',
    fontSize: 13,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statBadge: {
    backgroundColor: '#FFF3E0',
    color: '#E65100',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});