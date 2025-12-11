import CameraReact from '@/components/camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectorEquipo from './seleccionequipo';

export default function UserData({ sendData, inputData, tipo }:{sendData: (data: FormData) => Promise<number>, inputData: FormData, tipo: number})
{
    /*
    Tipo 1: Jugador
    Tipo 2: Director
    */

    const [error, setError] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    const [nombre, setNombre] = useState(inputData.get('nombre') as any || '');
    const [apellido, setApellido] = useState(inputData.get('apellido') as any || '');
    const [imageurl, setImageurl] = useState(inputData.get('image') as any || '');
    const [posicion, setPosicion] = useState(inputData.get('posicion') as any || '');

    const [idequipo, setIdequipo] = useState(0);

    const register = inputData.get('nombre')==null;

    function setEquipo(id: number)
    {
      setIdequipo(id);
    }

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
        if(!textRegex.test(apellido) || apellido.length < 3)
        {
            valido = false;
            setError('Apellido Invalido');
        }
        if(tipo == 1 && (!textRegex.test(posicion) || posicion.length < 3))
        {
            valido = false;
            setError('Posicion Invalida');
        }
        if(imageurl.length < 1)
        {
            valido = false;
            setError('Ingresar Foto de Perfil');
        }
        if(idequipo == 0)
        {
          valido = false;
          setError('Seleccionar Equipo');
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
    
    function savePhoto(uri: React.SetStateAction<string>)
    {
        setImageurl(uri);
        setShowCamera(false);
    }

    async function send()
    {
        if(!validar()) return;
        const formData = new FormData();
        formData.append('image', imageurl);
        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        if(tipo == 1) formData.append('posicion', posicion);
        if(tipo == 1) formData.append('equipo', idequipo + '');

        const respuesta = await sendData(formData);
    }

    return(
      <ScrollView contentContainerStyle={styles.screen}>
      {showCamera ? (
        <CameraReact onPicture={savePhoto} setShowCamera={setShowCamera} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.titulo}>
            {register ? 'Registrarse como ' : 'Editar '}
            {tipo == 1 ? 'Jugador' : 'Director Técnico'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#999"
            onChangeText={setNombre}
            value={nombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#999"
            onChangeText={setApellido}
            value={apellido}
          />
          {tipo == 1 ? (
            <>
            <TextInput
              style={styles.input}
              placeholder="Posición"
              placeholderTextColor="#999"
              onChangeText={setPosicion}
              value={posicion}
            />
            {register ? <SelectorEquipo sendData={setEquipo}/> : <></>}
            </>
          ) : null}

          <Text style={styles.label}>Foto de Perfil</Text>

          <View style={styles.botonesContainer}>
            <Pressable onPress={pickimage} style={styles.botonSecundario}>
              <Text style={styles.textoBotonSec}>Galería</Text>
            </Pressable>
            <Pressable onPress={() => setShowCamera(true)} style={styles.botonSecundario}>
              <Text style={styles.textoBotonSec}>Cámara</Text>
            </Pressable>
          </View>

          {imageurl ? (
            <Image source={{ uri: imageurl }} style={styles.imagen} />
          ) : (
            <View style={styles.imagenPlaceholder}>
              <Text style={styles.placeholderTexto}>Sin imagen</Text>
            </View>
          )}

          <Pressable onPress={send} style={styles.botonPrincipal}>
            <Text style={styles.textoBotonPrin}>{register ? 'Registrarse' : 'Guardar'}</Text>
          </Pressable>

          <Text style={styles.error}>{error}</Text>
        </ScrollView>
      )}
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  screen:{
    width: 400,
  },
  container: {
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  titulo: {
    color: '#E53935',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    width: '90%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderColor: '#E53935',
    borderWidth: 1.5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  botonSecundario: {
    backgroundColor: '#1E1E1E',
    borderColor: '#E53935',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  textoBotonSec: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 15,
  },
  imagen: {
    borderRadius: 100,
    width: 160,
    height: 160,
    marginVertical: 15,
    borderColor: '#E53935',
    borderWidth: 2,
  },
  imagenPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderColor: '#555',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  placeholderTexto: {
    color: '#777',
    fontSize: 14,
  },
  botonPrincipal: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: '60%',
    marginTop: 10,
  },
  textoBotonPrin: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});