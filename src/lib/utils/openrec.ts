export const updateGiftList = async () => {
  const res = await fetch("https://public.openrec.tv/external/api/v5/yell-products")
  return res.json()
}

export const getMovieId = async (channelId: string) => {
  const res = await fetch("https://public.openrec.tv/external/api/v5/movies?channel_id=" + channelId)
  return res.json()
}
