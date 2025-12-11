import HeaderReact from "@/components/header";
import UserData from "@/components/userdata";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Information() {
  const { tipo, id } = useLocalSearchParams();
  // Tipo, 1: Jugador, 2: Director, 3: Equipo

  const [tipousuario, setTipoUsuario] = useState('');
  const [propio, setPropio] = useState(false);
  const [editar, setEditar] = useState(false);
  //General
  const [imagen, setImage] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [posicion, setPosicion] = useState('');
  const [equipo, setEquipo] = useState('');
  const [equipoid, setEquipoid] = useState('');
  const [goles, setGoles] = useState('');
  const [victorias, setVictorias] = useState('');
  const [director, setDirector] = useState('');
  const [directorid, setDirectorid] = useState('');
  const [jugadores, setJugadores] = useState<any[]>([]);
  const router = useRouter();

  const [oldmail, setOldmail] = useState('');
  const [oldpassword, setOldpassword] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const [formdata, setFormDatausu] = useState<FormData | null>(null);

useEffect(() => {
    (async () => {
        setTipoUsuario(await AsyncStorage.getItem('tipousuario') || '0');
        setOldmail(await AsyncStorage.getItem('email') as any || '');
    })();
    if(tipo == "1")
    {
        fetch('http://localhost:3031/getJugador', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
        })
        .then(response => response.json())
        .then(async data => {
            setImage(data[0].imagen);
            setNombre(data[0].nombre);
            setApellido(data[0].apellido);
            setPosicion(data[0].posicion);
            setGoles(data[0].goles);
            setEquipoid(data[0].equipo);

            fetch('http://localhost:3031/getEquipo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: data[0].equipo}),
            })
            .then(response2 => response2.json())
            .then(data2 => {
                if(data2.length != 0) setEquipo(data2[0].nombre);
            });

            setPropio((await AsyncStorage.getItem('tipousuario') == "1" && await AsyncStorage.getItem('id_tablausuario') == id));
            
            const fullImageUrl = 'http://localhost:3031' + data[0].imagen;
            try 
            {
                const response = await fetch(fullImageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = () => {
                    if(reader.result && typeof reader.result === 'string') 
                    {
                        const base64data = reader.result.split(',')[1];
                        const newForm = new FormData();
                        newForm.append('image', `data:image/jpeg;base64,${base64data}`);
                        newForm.append('nombre', data[0].nombre);
                        newForm.append('apellido', data[0].apellido);
                        newForm.append('posicion', data[0].posicion);
                        setFormDatausu(newForm);
                    }
                };
                reader.readAsDataURL(blob);
            } catch (error) {
              console.error('Error convirtiendo imagen a base64:', error);
            }
        });
    }
    else if(tipo == "2")
    {
        fetch('http://localhost:3031/getDirector', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
        })
        .then(response => response.json())
        .then(async data => {
            setImage(data[0].imagen);
            setNombre(data[0].nombre);
            setApellido(data[0].apellido);
            setVictorias(data[0].victorias);

            setPropio((await AsyncStorage.getItem('tipousuario') == "2" && await AsyncStorage.getItem('id_tablausuario') == id));
            const fullImageUrl = 'http://localhost:3031' + data[0].imagen;
            try 
            {
                const response = await fetch(fullImageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = () => {
                    if(reader.result && typeof reader.result === 'string') 
                    {
                        const base64data = reader.result.split(',')[1];
                        const newForm = new FormData();
                        newForm.append('image', `data:image/jpeg;base64,${base64data}`);
                        newForm.append('nombre', data[0].nombre);
                        newForm.append('apellido', data[0].apellido);
                        setFormDatausu(newForm);
                    }
                };
                reader.readAsDataURL(blob);
            } catch (error) {
              console.error('Error convirtiendo imagen a base64:', error);
            }
        });
    }
    else
    {
        fetch('http://localhost:3031/getEquipo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
        })
        .then(response => response.json())
        .then(async data => {
            setImage(data[0].escudo);
            setNombre(data[0].nombre);
            setGoles(data[0].goles);
            setVictorias(data[0].victorias);
            setDirectorid(data[0].director);
            fetch('http://localhost:3031/getDirector', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: data[0].director}),
            })
            .then(response2 => response2.json())
            .then(data2 => {
                if(data2.length != 0) setDirector(data2[0].nombre + " " + data2[0].apellido);
            });
            setPropio((await AsyncStorage.getItem('tipousuario') == "2" && await AsyncStorage.getItem('id_tablausuario') == data[0].director));
        });
        fetch('http://localhost:3031/getJugadoresEquipo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_equipo: id}),
        }).then(response => response.json())
        .then(data => setJugadores(data));
    }
  }, [])

  async function anotarse()
  {
    let email = await AsyncStorage.getItem('email');
    fetch('http://localhost:3031/cambiarEquipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, id_equipo: id}),
    });
  }

  async function sendJugador(formData: FormData) : Promise<number>
  {
    formData.append('email', mail);
    formData.append('oldmail', oldmail);
    formData.append('password', password);
    formData.append('oldpassword', oldpassword);
    formData.append('isGoogleUser', 'false');
    await fetch('http://localhost:3031/editJugador', {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
    .then(data => {
        if(data == 0) router.push("/");
    });
    
    return 1;
  }

  async function sendDirector(formData: FormData) : Promise<number>
  {
    formData.append('email', mail);
    formData.append('oldmail', oldmail);
    formData.append('password', password);
    formData.append('oldpassword', oldpassword);
    formData.append('isGoogleUser', 'false');
    await fetch('http://localhost:3031/editDirector', {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
    .then(data => {
        if(data == 0) router.push("/");
    });
    
    return 1;
  }

  return (
    <View style={styles.screen}>
    <HeaderReact />
    {editar ? (
      <>
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Antiguo"
            onChangeText={setOldmail}
            value={oldmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Nuevo"
            onChangeText={setMail}
            value={mail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña Antigua"
            secureTextEntry
            onChangeText={setOldpassword}
            value={oldpassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña Nueva"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>
        {tipo == "1" ? (
            <UserData sendData={sendJugador} inputData={formdata as FormData} tipo={1}/>
            ) : (
            <UserData sendData={sendDirector} inputData={formdata as FormData} tipo={2}/>
            )}
      </>
    ) : (
      <ScrollView contentContainerStyle={styles.infoContainer}>
        <Image
          style={styles.imagen}
          source={{ uri: 'http://localhost:3031' + imagen }}
        />
        <Text style={styles.name}>{nombre} {tipo != "3" ? apellido : ''}</Text>

        <View style={styles.statsContainer}>
          {tipo == "1" && (
            <>
              <Text style={styles.statLabel}>Posición: <Text style={styles.statValue}>{posicion}</Text></Text>
              <Text style={styles.statLabel}>Equipo Actual: <Text style={styles.statValue}>{equipo || 'Sin Equipo'}</Text></Text>
              <Text style={styles.statLabel}>Goles: <Text style={styles.statValue}>{goles}</Text></Text>
            </>
          )}
          {tipo == "2" && (
            <Text style={styles.statLabel}>Victorias: <Text style={styles.statValue}>{victorias}</Text></Text>
          )}
          {tipo == "3" && (
            <>
              <Text style={styles.statLabel}>Director Técnico: <Text style={styles.statValue}>{director}</Text></Text>
              <Text style={styles.statLabel}>Goles del Equipo: <Text style={styles.statValue}>{goles}</Text></Text>
              <Text style={styles.statLabel}>Victorias: <Text style={styles.statValue}>{victorias || 0}</Text></Text>
              <Text style={styles.statLabel}>Jugadores: <Text style={styles.statValue}>{jugadores.length}</Text></Text>
                {jugadores.map((item) => (
                          <View key={item.id}>
                            <Image
                              style={styles.imagenchica}
                              source={{ uri: 'http://localhost:3031' + item.imagen }}
                            />
                            <Text style={styles.statValue}>{item.nombre} {item.apellido}, {item.posicion}</Text>
                    </View>
                ))}
            </>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {propio && tipo != '3' && (
            <Pressable style={styles.boton} onPress={() => setEditar(true)}>
              <Text style={styles.subtitulo}>Editar</Text>
            </Pressable>
          )}
          {tipousuario == '1' && tipo == '3' && (
            <Pressable style={styles.boton} onPress={anotarse}>
              <Text style={styles.subtitulo}>Inscribirse al Equipo</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#111111', // fondo gris oscuro
      alignItems: 'center',
    },
    infoContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      width: '100%',
    },
    imagen: {
      borderRadius: 10,
      width: 120,
      height: 120,
      marginBottom: 15,
    },
    imagenchica: {
        borderRadius: 10,
        width: 80,
        height: 80,
        marginTop: 15,
      },
    name: {
      fontSize: 22,
      fontWeight: '600',
      color: 'white',
      marginBottom: 15,
    },
    statsContainer: {
      backgroundColor: '#222222', // gris medio para tarjetas
      borderRadius: 8,
      padding: 15,
      width: 300,
      marginBottom: 20,
    },
    statLabel: {
      fontSize: 16,
      color: 'white',
      marginBottom: 8,
    },
    statValue: {
      color: '#ff4b4b', // rojo para valores
      fontWeight: '600',
    },
    buttonsContainer: {
      width: '100%',
      alignItems: 'center',
    },
    boton: {
      backgroundColor: '#d9262f',
      marginVertical: 8,
      borderColor: '#800000',
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
      width: 220,
      alignItems: 'center',
    },
    subtitulo: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
    },
    editContainer: {
      width: '90%',
      marginTop: 20,
      alignItems: 'center',
    },
    input: {
      backgroundColor: '#333333',
      width: '100%',
      height: 45,
      borderColor: '#ff4b4b',
      borderWidth: 2,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      color: 'white',
    },
  });