import { HStack, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { api } from '../services/api';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolCardProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import {Guesses} from '../components/Guesses'


interface RouteParams {
    id: string;
}

export function Details() {
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do Grupo'>('Seus Palpites');
    const [isLoading, setIsloading] = useState(true);
    const [poolDetails, setpoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const toast = useToast();

    const { id } = useRoute().params as RouteParams;

    async function fetchPoolDetails() {
        try {

            const response = await api.get(`/pools/${id}`);
            console.log(response.data.pools.Participants)
            setpoolDetails(response.data.pools)

        } catch (err) {
            console.log(err)
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsloading(false);
        }
    }

    async function handlecodeShare(){
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(()=>{
        fetchPoolDetails();
    },[id])

    if (isLoading) {
        return (
            <Loading />
        );
    }


    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header 
            title={poolDetails.title} 
            showBackButton 
            showShareButton
            onShare={handlecodeShare} />
            {
                poolDetails._count?.Participants >0 ?
                <VStack px={5} flex={1}> 
                    <PoolHeader data={poolDetails}/>

                    <HStack bgColor="gray.800" rounded='sm' p={1} mb={5}>
                        <Option 
                        title="Seus Palpites" 
                        isSelected={optionSelected === 'Seus Palpites'}
                        onPress={()=>setOptionSelected('Seus Palpites')}
                        />

                        <Option 
                        title="Ranking do Grupo" 
                        isSelected={optionSelected === 'Ranking do Grupo'}
                        onPress={()=>setOptionSelected('Ranking do Grupo')}
                        />
                    </HStack>

                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack>

                : <EmptyMyPoolList code={poolDetails.code} />

            }
        </VStack>
    )
}