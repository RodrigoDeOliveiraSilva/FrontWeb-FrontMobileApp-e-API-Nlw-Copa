import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import {Input} from '../components/Input'
import { api } from '../services/api';


export function Find() {
    const toast = useToast();
    const [code, setCode] = useState('');
    const [isLoading, setIsloading] = useState(false);
    const { navigate } = useNavigation();
    
    async function handleJoinPool(){
        try{
            setIsloading(true);

            if(!code.trim){
                return  toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            await api.post('/pools/join',{code});

            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            })
            
            navigate('pools');

            


        }catch(err){
            console.log(err)
            setIsloading(false);
            return toast.show({
                title: 'Bolão não localizado',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }



    return (
        <VStack flex={1} bgColor="gray.900"  >
            <Header title="Buscar por código" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl"  textAlign="center">
                    Encontrar um bolão através de {'\n'} seu código único
                </Heading>

                <Input
                mb={2}
                placeholder="Qual o código do bolão?"
                autoCapitalize='characters'
                onChangeText={setCode}
                />

                <Button
                title="BUSCAR BOLÃO"
                isLoading={isLoading}
                onPress={handleJoinPool}
                />
            </VStack>
        </VStack>
    )
}