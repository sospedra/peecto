import { useReducer } from 'react'

type Message = {
  author: string
  content: string
  createdAt: number
  id: string
}

export type ChatAction =
  | { type: 'add-message'; payload: Message }
  | { type: 'update-nodes'; payload: string[] }

const defaultState = {
  messages: [] as Message[],
  nodes: [] as string[],
}

const chatReducer = (state: typeof defaultState, action: ChatAction) => {
  switch (action.type) {
    case 'add-message':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'update-nodes':
      return { ...state, nodes: action.payload }
    default:
      return state
  }
}

export const createMessage = (
  author: string,
  content: string,
  createdAt = new Date().getTime(),
): Message => ({
  author,
  content,
  createdAt,
  id: `${author}-${createdAt}`,
})

export const useChat = () => {
  const [chat, dispatch] = useReducer(chatReducer, defaultState)
  return { ...chat, dispatch }
}
