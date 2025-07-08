import { myAxios } from "@/axios"

export default function useGetBeatmapInfo() {
    return async (beatmap_id) => {
        const url = `https://osu.ppy.sh/api/v2/beatmaps/${beatmap_id}`
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
        }

        const response = await myAxios.get(url, { headers })
        return response.data
    }
}