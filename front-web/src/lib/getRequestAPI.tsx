import { api } from "./axios"

export async function getRequestAPI() {
    const [poolBolaoCountResponse, guessPalpitesCountResponse, userCountResponse] = await Promise.all([
        api.get('pools/count'),
        api.get('guessPalpites/count'),
        api.get('user/count')
      ])
    
    
      return {
          poolCount: poolBolaoCountResponse.data.count,
          guessCount : guessPalpitesCountResponse.data.count,
          usersCount: userCountResponse.data.count,
    }
}