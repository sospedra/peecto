import { useReducer } from 'react'

const defaultState = {
  startAt: 0,
  round: 0,
  roundLimit: 5,
  roundTime: 60,
  turn: 0,
  master: '',
  scoreboard: [] as { playerID: string; score: number }[],
  players: [] as { playerID: string; display: string }[],
}

type GameState = typeof defaultState
export type GameAction =
  | {
      type: 'start'
      payload: { master: GameState['master']; players: GameState['players'] }
    }
  | { type: 'next-round' }
  | { type: 'next-turn' }
  | { type: 'score'; payload: { scores: { [playerID: string]: number } } }

const reducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case 'start': {
      return {
        ...state,
        startAt: new Date().getTime(),
        master: action.payload.master,
        players: action.payload.players,
        scoreboard: action.payload.players.map(({ playerID }) => ({
          playerID,
          score: 0,
        })),
      }
    }
    case 'next-round': {
      return { ...state, round: state.round + 1, turn: 0 }
    }
    case 'next-turn': {
      return { ...state, turn: state.turn + 1 }
    }
    case 'score': {
      const scoreboard = state.scoreboard.map((record) => {
        const points = action.payload.scores[record.playerID] || 0
        return { ...record, score: record.score + points }
      })
      return { ...state, scoreboard }
    }
    default:
      return state
  }
}

export const useGame = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)
  return { ...state, dispatch }
}
