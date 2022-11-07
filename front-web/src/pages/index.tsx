
interface HomeProps{
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

import Image from "next/image"
import appPreviewimg from '../assets/app-nlw-copa-preview.png'
import logo from '../assets/logo.svg'
import usersAvatar from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react";
import { getRequestAPI } from "../lib/getRequestAPI";


export default function Home(props: HomeProps) {

    const[poolTitle, setPoolTitle] = useState('')

    async function createPoll(event: FormEvent){ 
      event.preventDefault()

      try{
        const response = await api.post('/pools',{
          title: poolTitle,
        });
        const {code} = response.data
        await navigator.clipboard.writeText(code)
        alert(`Bolão criado com sucesso, o código "${code}" foi copiado para a área de transferência`)
      }catch(err){
        console.log(err)
        alert('Falha ao criar o bolão, tente novamente')
      }

      setPoolTitle('')
     
    }

  return (
   <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">

    <main>
      <Image src={logo} alt="Logo" />

      <h1 className="mt-14 text-white text-5xl font-bold leading-tight "
      >Crie seu próprio bolão da copa e compartilhe entre amigos!
      </h1>

      <div className=" mt-10 flex items-center gp-2">
        <Image src={usersAvatar} alt=""/>
        <strong className="text-gray-100 text-xl">
          <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
        </strong>
      </div>

        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
          className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-white text-sm" 
          type="text" 
          required 
          placeholder="Qual nome do seu bolão"
          onChange={event => setPoolTitle(event.target.value)}
          value={poolTitle}
          />

          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-600"
          type='submit'>Criar meu bolão</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed"
        > Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas</p>

        <div className="mt-10 pt-10 border-gray-600 flex  items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt=""/>
           <div className="flex flex-col">
            <span className="font-bold text-2xl">+{props.poolCount}</span>
            <span>Bolões criados</span>
           </div>

          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt=""/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
           </div>

          </div>
        </div>
    </main>

    <Image 
    src={appPreviewimg} 
    alt ='Dois celulares'
    quality={100}
    />

   </div>
  )
}
export const getStaticProps = async()=>{
  const response = await getRequestAPI()

  return { 
    props: response,
    revalidate: 3000,
  }
}


