import HeaderReact from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Equipo()
{
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [imageurl, setImageurl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            if(await AsyncStorage.getItem('tipousuario') != '2') router.push("/");
        })();
    }, []);

    function validar()
    {
        setError('');
        let valido = true;
        let textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
        if(!textRegex.test(nombre) || nombre.length < 3)
        {
            valido = false;
            setError('Nombre Invalido');
        }
        if(imageurl.length < 1)
        {
            valido = false;
            setError('Ingresar Foto de Perfil');
        }
        return valido;
    }

    async function pickimage()
    {
        if(Platform.OS !== 'web') 
        {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if(status !== 'granted') return;
        }
       
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [4, 4], 
            quality: 1, 
            base64: true,
        });
      
        if(!result.canceled) 
        {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImageurl(base64Img);
        }
    }

    async function send()
    {
        if(!validar()) return;
        const formData = new FormData();
        formData.append('escudo', imageurl);
        formData.append('nombre', nombre);
        formData.append('email', await AsyncStorage.getItem('email') || '');

        let respuesta = await fetch('http://localhost:3031/addEquipo', {
            method: 'POST',
            body: formData,
        });
        router.push("/");
    }

    return (
      <View style={styles.screen}>
      <HeaderReact />
      <View style={styles.container}>
        <Text style={styles.titulo}>Crear Equipo</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#ccc"
          onChangeText={setNombre}
          value={nombre}
        />
  
        <Pressable onPress={pickimage} style={styles.botonmin}>
          <Text style={styles.subtitulo}>Galería</Text>
        </Pressable>
  
        {imageurl ? (
          <Image source={{ uri: imageurl }} style={styles.imagen} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: 'white' }}>No hay imagen seleccionada</Text>
          </View>
        )}
  
        <Pressable onPress={send} style={styles.boton}>
          <Text style={styles.subtitulo}>Crear Equipo</Text>
        </Pressable>
  
        {error.length > 0 && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
    );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    paddingTop: 20,
  },
  container: {
    backgroundColor: '#222222',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333333',
    width: '100%',
    height: 45,
    borderColor: '#ff4b4b',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
  boton: {
    backgroundColor: '#d9262f',
    marginTop: 15,
    borderColor: '#800000',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    width: '70%',
    alignItems: 'center',
  },
  botonmin: {
    backgroundColor: '#4f94ca',
    marginTop: 10,
    borderColor: '#333333',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    width: 140,
    alignItems: 'center',
  },
  subtitulo: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  imagen: {
    borderRadius: 10,
    width: 200,
    height: 200,
    marginVertical: 15,
  },
  placeholder: {
    borderRadius: 10,
    width: 200,
    height: 200,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  error: {
    color: '#d9262f',
    fontSize: 15,
    marginTop: 10,
  },
});