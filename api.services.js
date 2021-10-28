const axios = require('axios')

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000
});

const getGames = async () => {
    let games = await instance.get('/game/list')
    return games.data
}

const getPlayerInGame = async (playerId, gameId) => {
    let playerInGame = await instance.get(`/player/${playerId}/game/${gameId}`)
    return playerInGame.data
}

const getPlayerListInGame = async (gameId) => {
    const playerList = await instance.get(`/game/${gameId}/players`)
    return playerList.data
}

const initializePlayer = async (playerData, playerName) => {
    playerData.desiredName = playerName
    let player = await instance.post('/player/create', playerData)
    return player.data
}

const addPlayerToGame = async (gameId, playerData) => {
  let addToGame = await instance.post(`/game/addplayer/${gameId}`, playerData)
  return addToGame.data
}

const removePlayerFromGame = async (gameId, playerId) => {
    let removeFromGame = await instance.delete(`/game/removeplayer/game/${gameId}/player/${playerId}`)
    return removeFromGame.data
}

const getGamesByPlayerId = async (playerId) => {
    const meGames = await instance.get(`/game/player/${playerId}`)
    return meGames.data
}

const createGame = async (game) => {
    const response = await instance.post(`/game/create`, game)
    return response.data
}

module.exports = {
    createGame,
    getGames,
    getGamesByPlayerId,
    getPlayerListInGame,
    addPlayerToGame,
    removePlayerFromGame,
    initializePlayer,
    getPlayerInGame,
}