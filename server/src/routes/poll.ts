import { FastifyInstance } from "fastify"
import { request } from "http"
import { send } from "process"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"


export async function pollRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const count = await prisma.poolBolao.count()
        return { count }
    })

    fastify.post('/pools', async (request, reponse) => {
        const createPollBolaoBody = z.object({
            title: z.string(),
        })

        const { title } = createPollBolaoBody.parse(request.body)

        const generate = new ShortUniqueId({ length: 6 })

        const code = String(generate()).toUpperCase();


        try {
            await request.jwtVerify()
            await prisma.poolBolao.create({
                data: {
                    title,
                    code,
                    ownerUserId: request.user.sub,

                    Participants:{
                        create:{
                            userId: request.user.sub
                        }
                    }
                }
            })
            

            
        } catch {
            await prisma.poolBolao.create({
                data: {
                    title,
                    code
                }
            })
        }



        return reponse.status(201).send({ code })
    })

    fastify.post('/pools/join',{
        onRequest: [authenticate]
    }, async (request, response)=>{
        const joinPoolBody = z.object({
            code: z.string(),
        })

        const {code} = joinPoolBody.parse(request.body)

        const pool = await prisma.poolBolao.findUnique({
            where:{
                code,
            },
            include:{
                Participants:{
                    where:{
                        userId: request.user.sub,
                    }
                }
            }
        })

        if(!pool){
            return response.status(400).send({
                message: 'Pool not found'
            })
        }

        if(pool.Participants.length>0){
            return response.status(400).send({
                message: 'User already joined this pool'
            })
        }

        if(!pool.ownerUserId){
            await prisma.poolBolao.update({
                where:{
                    id: pool.id,
                },
                data:{
                    ownerUserId: request.user.sub,
                }
            })
        }

        await prisma.participant.create({
            data:{
                poolBolaoId: pool.id,
                userId: request.user.sub
            }
        })

        return response.status(201).send({
            message:'Sucess'
        })
    })

    fastify.get('/pools',{
        onRequest: [authenticate]
    }, async (request)=>{
        const pools = await prisma.poolBolao.findMany({
            where:{
                Participants:{
                    some:{
                        userId: request.user.sub
                    }
                }
            },
            include:{
                _count:{
                    select:{
                        Participants: true
                    }
                },
                Participants:{
                    select:{
                        id: true,
                        User:{
                            select:{
                                avatarUrl: true,
                            }
                        }
                    },
                    take:4,
                },
                owner:{
                    select:{
                        id: true,
                        name: true,
                    }
                },
            }
        })

        return {pools}
    })

    fastify.get('/pools/:id',{
        onRequest: [authenticate],
    }, async (request)=>{
        const getPoolParams = z.object({
            id: z.string(),
        })

        const {id} = getPoolParams.parse(request.params)

        const pools = await prisma.poolBolao.findUnique({
            where:{
                id,
                },
            include:{
                _count:{
                    select:{
                        Participants: true
                    }
                },
                Participants:{
                    select:{
                        id: true,
                        User:{
                            select:{
                                name: true,
                                avatarUrl: true,
                            }
                        }
                    },
                    take:4,
                },
                owner:{
                    select:{
                        id: true,
                        name: true,
                    }
                },
            }
        })

        return {pools}
    })
}