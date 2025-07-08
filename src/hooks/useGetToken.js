import { myAxios } from "@/axios"

export default function useGetToken(){
    return async () => { 
        const url = "https://osu.ppy.sh/oauth/token"
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        const body = new URLSearchParams({
            client_id: localStorage.getItem('client_id') || '',
            client_secret: localStorage.getItem('client_secret') || '',
            grant_type: "client_credentials",
            scope: "public",
        })
    
        const response = await myAxios.post(url, body, { headers })
        localStorage.setItem('access_token', response.data.access_token)
    }
}
