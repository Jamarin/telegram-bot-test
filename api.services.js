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

const changePlayerName = async (playerId, playerName) => {
    const player = await instance.put(`/player/change-name/`, {
        playerId: playerId,
        playerName: playerName
    })
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

const cancelGame = async (gameId, authorId) => {
    const response = await instance.put(`/game/cancel/${gameId}/author/${authorId}`)
    let playersInGame = []
    if(response.data !== null) {
        playersInGame = await getPlayerListInGame(gameId)
    }
    return {
        gameCanceled: response.data !== null,
        playersList: playersInGame
    }
}

const playerExists = async(playerData) => {
    const response = await instance.get(`/player/${playerData.id}`)
    return response.data
}

module.exports = {
    changePlayerName,
    cancelGame,
    createGame,
    getGames,
    getGamesByPlayerId,
    getPlayerListInGame,
    addPlayerToGame,
    removePlayerFromGame,
    initializePlayer,
    getPlayerInGame,
    playerExists
}