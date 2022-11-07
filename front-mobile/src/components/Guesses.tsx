import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

import { Game, GameProps } from '../components/Game'
import { Loading } from '../components/Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsloading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setfirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsloading(true)

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

    } catch (err) {
      console.log(err)
      toast.show({
        title: 'Nao foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsloading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: 'Palpite enviado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
      fetchGames();


    } catch (err) {
      console.log(err)
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setfirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => { handleGuessConfirm(item.id) }}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={()=> <EmptyMyPoolList code={code}/>}
    />
  );
}