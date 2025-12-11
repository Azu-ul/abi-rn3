import HeaderReact from '@/components/header';
import UserData from '@/components/userdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, GoogleSigninButton, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function sesion() 
{
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "204903815937-mphcir1er2shc5125248ffvanr66r8dr.apps.googleusercontent.com",
    });
  });

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipo, setTipo] = useState(false);
  const [error, setError] = useState('');
  const [iniciando, setIniciando] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState(0);

  const [emailusu, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  async function saveUsuario(altemail : string)
  {
    let respuesta = await fetch('http://localhost:3031/getUsuarioData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email: (emailusu == '' ? altemail : emailusu)}),
    });
    let data2 = await respuesta.json();
    await AsyncStorage.setItem('email', (emailusu == '' ? altemail : emailusu));
    await AsyncStorage.setItem('idusuario', String(data2[0].id));
    await AsyncStorage.setItem('tipousuario', String(data2[0].tipo as string));
    await AsyncStorage.setItem('id_tablausuario', String(data2[0].id_tabla as string));

    return 0;
  }

  async function handleGoogleSignIn()
  {
    try 
    {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if(isSuccessResponse(response))
      {
        const { idToken, user } = response.data;
        const { email } = user;
        setEmail(email);
        
        let res = await fetch('http://localhost:3031/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email: email, password: '', isGoogleUser: 'true'}),
        });
        let data = await res.json();
        if(data == false)
        {
          res = await fetch('http://localhost:3031/addUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: '', isGoogleUser: 'true'}),
          });
          data = await res.json();

          setIniciando(true);
        }
        else
        {
          await saveUsuario(email);
          router.push("/");
        }
      }
      setIsSubmitting(false);
    }
    catch(error)
    {
      setIsSubmitting(false);
    }
  }

  function validar()
  {
    setError('');
    let valido = true;
    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if(!emailRegex.test(emailusu))
    {
        valido = false;
        setError('Email Invalido');
    }
    if(password.length < 6 || password.length > 24)
    {
        valido = false;
        setError('Contraseña debe ser de al entre 6 y 24 caracteres');
    }
    return valido;
  }

  async function inicioSesion()
  {
    setError('');
    if(!validar()) return;
    
    let res = await fetch('http://localhost:3031/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: emailusu, password: password, isGoogleUser: 'false'}),
    });
    let data = await res.json();
    if(data == false)
    {
        setError('Usuario Inexistente');
    }
    else
    {
      await saveUsuario('');
      router.push("/");
    }
  }

  async function registro()
  {
    setError('');
    if(!validar()) return;
    if(confirmacion != password)
    {
      setError('Contraseña Incorrecta');
      return;
    } 
    
    let res = await fetch('http://localhost:3031/addUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: emailusu, password: password, isGoogleUser: 'false'}),
    });
    let data = await res.json();
    if(data == 1)
    {
        setError('Email Ocupado');
    }
    else setIniciando(true);
  }

  async function sendJugador(formData: FormData) : Promise<number>
  {
    formData.append('email', emailusu);
    await fetch('http://localhost:3031/addJugador', {
        method: 'POST',
        body: formData,
    });
    await saveUsuario('');
    router.push("/");
    return 1;
  }

  async function sendDirector(formData: FormData) : Promise<number>
  {
    formData.append('email', emailusu);
    await fetch('http://localhost:3031/addDirector', {
        method: 'POST',
        body: formData,
    });
    await saveUsuario('');
    router.push("/");
    return 1;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <HeaderReact />
        {!iniciando ? (
          <>
            <Text style={styles.title}>Iniciar Sesión o Registrarse</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Inicio</Text>
              <Switch
                onValueChange={setTipo}
                value={tipo}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={tipo ? '#f5dd4b' : '#f4f3f4'}
              />
              <Text style={styles.switchLabel}>Registro</Text>
            </View>

            <View style={styles.container}>
              <Text style={styles.formTitle}>
                {tipo ? 'Registro' : 'Inicio de Sesión'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                onChangeText={setPassword}
              />
              {tipo && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Contraseña"
                  secureTextEntry
                  onChangeText={setConfirmacion}
                />
              )}
              <Pressable
                onPress={() => {
                  tipo ? registro() : inicioSesion();
                }}
                style={styles.boton}
              >
                <Text style={styles.subtitulo}>
                  {tipo ? 'Registrarse' : 'Iniciar Sesión'}
                </Text>
              </Pressable>
              {error !== '' && <Text style={styles.error}>{error}</Text>}
            </View>

            <View style={styles.googleContainer}>
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={handleGoogleSignIn}
                disabled={isSubmitting}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Seleccionar tipo de registro</Text>
            <Pressable
              style={styles.boton}
              onPress={() => {
                router.push('/');
              }}
            >
              <Text style={styles.subtitulo}>Continuar como Espectador</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTipoRegistro(1);
              }}
              style={styles.boton}
            >
              <Text style={styles.subtitulo}>Registrarse como Jugador</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTipoRegistro(2);
              }}
              style={styles.boton}
            >
              <Text style={styles.subtitulo}>
                Registrarse como Director Técnico
              </Text>
            </Pressable>

            {tipoRegistro == 0 ? (
              <></>
            ) : tipoRegistro == 1 ? (
              <UserData
                sendData={sendJugador}
                inputData={new FormData()}
                tipo={1}
              />
            ) : (
              <UserData
                sendData={sendDirector}
                inputData={new FormData()}
                tipo={2}
              />
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    alignItems: 'center',
    backgroundColor: '#111111', // gris muy oscuro de fondo
    paddingVertical: 30,
    height: '100%',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 15,
    marginHorizontal: 10,
    color: 'white',
  },
  container: {
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222', // gris oscuro
    width: 320,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 15,
  },
  formTitle: {
    color: '#ff4b4b', // rojo fuerte
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333333', // gris medio
    width: 250,
    height: 40,
    borderColor: '#ff4b4b',
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    color: 'white',
    paddingHorizontal: 8,
  },
  boton: {
    backgroundColor: '#d9262f', // rojo destacado
    marginVertical: 5,
    borderColor: '#800000',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    width: 220,
  },
  subtitulo: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
    fontSize: 15,
    color: '#ff4b4b',
    marginTop: 5,
  },
  googleContainer: {
    marginTop: 15,
  },
});