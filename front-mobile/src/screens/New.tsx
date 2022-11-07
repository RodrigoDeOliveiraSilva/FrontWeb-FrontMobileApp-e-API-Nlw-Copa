import { Heading, VStack, Text, useToast } from 'native-base';
import { useState } from 'react';

import Logo from '../assets/logo.svg'

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import {Input} from '../components/Input'
import { api } from '../services/api';

export function New() {
    const toast = useToast();
    const [namePoll, setNamePoll] = useState('');
    const [isLoading, setIsloading] = useState(false);

    async function handlePollCreate(){
        if(!namePoll.trim()){
            return toast.show({
                title: 'Informe um nome para seu bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        
        try{
            setIsloading(true);

            const code = await api.post('/pools',{ title: namePoll.toUpperCase() })

            toast.show({
                title: `Bolão criado, compartilhe o código ${code} com seus amigos`,
                placement: 'top',
                bgColor: 'green.500'
            })

            setNamePoll('');

        }catch(err){
            console.log(err)
            toast.show({
                title: 'Não foi possível criar o bolão, tente novamente!',
                placement: 'top',
                bgColor: 'red.500'
            })

        }finally{
            setIsloading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900"  >
            <Header title="Criar novo bolão" />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo />
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa {'\n'} e compartilhe entre seus amigos
                </Heading>

                <Input
                mb={2}
                placeholder="Qual nome do seu novo bolão?"
                onChangeText={setNamePoll}
                value={namePoll}
                />

                <Button
                title="CRIAR MEU BOLÃO"
                onPress={handlePollCreate}
                isLoading={isLoading}
                />

                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá
                    usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}