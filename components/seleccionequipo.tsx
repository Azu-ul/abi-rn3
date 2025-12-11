import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function SelectorEquipo({ sendData }:{sendData: (id: number) => void })
{
    const [equipos, setEquipos] = useState<any[]>([]);
    const [activo, setActivo] = useState(false);
    const [equipoNombre, setNombre] = useState('-- Seleccionar Equipo --');
    const [equipoId, setID] = useState(0);

    useEffect(() => {
        fetch('http://localhost:3031/getEquipos')
          .then(response => response.json())
          .then(data => setEquipos(data));
    }, []);

    async function select(id : number, nombre : string)
    {
        setID(id);
        setNombre(nombre);
        setActivo(false);
        sendData(id);
    }

    return(
        activo ? 
        <>
            {equipos.map((equipo, index) => {
                return(
                    <Pressable onPress={() => {select(equipo.id, equipo.nombre)}} style={styles.input} key={index}>
                        <Text style={styles.subtitulo}>{equipo.nombre}</Text>
                    </Pressable>)
            })}
        </>
        :
        <>
            <Pressable onPress={() => {setActivo(true)}} style={styles.input}>
                <Text style={styles.subtitulo}>{equipoNombre}</Text>
            </Pressable>
        </>
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
    top: 5,
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