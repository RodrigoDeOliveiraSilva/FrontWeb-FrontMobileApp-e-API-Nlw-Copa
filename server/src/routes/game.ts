import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"


export async function gameRoutes(fastify: FastifyInstance){
    fastify.get('/pools/:id/games',{
        onRequest: [authenticate],
    }, async (request)=>{
        const getPoolParamns = z.object({
            id: z.string(),
        })

        const {id} = getPoolParamns.parse(request.params)

        const game = await prisma.game.findMany({
            orderBy:{
                date: 'desc',
            },
            include:{
                GuessPalpites:{
                    where:{
                        participant:{
                            userId: request.user.sub,
                            poolBolaoId: id,
                        }
                    }
                }
            }
        })

        return {
            game: game.map(game=>{
                return{
                    ...game,
                    guess: game.GuessPalpites.length >0 ? game.GuessPalpites[0] : null,
                    GuessPalpites: undefined,
                }
            })
        }
    })
}
