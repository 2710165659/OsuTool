import { myAxios } from "@/axio"

export default useGetToken = async (client_id, client_secret) => {
    const url = "https://osu.ppy.sh/oauth/token"
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    const body = new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "client_credentials",
        scope: "public",
    })

    const response = await myAxios.post(url, body, { headers });
    return response.data.access_token
}
