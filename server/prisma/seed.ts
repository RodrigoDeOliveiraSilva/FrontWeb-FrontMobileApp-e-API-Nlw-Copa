import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Pessoa',
            email: 'pessoa@gmail.com',
            avatarUrl: 'https://github.com/RodrigoDeOliveiraSilva.png'
        }
    })

    const poolBolao = await prisma.poolBolao.create({
        data: {
            title: 'Exemple Pool',
            code:'BOL123',
            ownerUserId: user.id,

            Participants:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T10:00:00.688Z',
            fisrstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    }) 

    await prisma.game.create({
        data: {
            date: '2022-12-03T12:00:00.688Z',
            fisrstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            GuessPalpites:{
                create:{
                    fistTeamPoints: 2,
                    secondTeamPoints: 0,

                    participant:{
                        connect:{
                            userId_poolBolaoId:{
                                userId: user.id,
                                poolBolaoId: poolBolao.id,
                            }
                        }
                    }
                }
            }
        }
    }) 

}

main()