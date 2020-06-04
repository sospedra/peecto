import { useReducer, useEffect, useRef, MutableRefObject } from 'react'
import { createLog } from './log'

const log = createLog('use-canvas')

export type CanvasAction =
  | { type: 'drag'; payload: { x: number; y: number } }
  | { type: 'dragstart'; payload: { x: number; y: number } }
  | { type: 'dragend' }
  | { type: 'save' }
  | { type: 'undo' }

const defaultState = {
  bg: '#fabada',
  color: 'black',
  history: [] as ImageData[],
  isDragging: false,
  size: 5,
  dimensions: { width: 500, height: 500 },
}

const createCanvasReducer = (ref: MutableRefObject<HTMLCanvasElement>) => {
  return (state: typeof defaultState, action: CanvasAction) => {
    const context = ref.current.getContext('2d')

    switch (action.type) {
      case 'dragstart': {
        log('dragstart', action.payload)
        context.moveTo(action.payload.x, action.payload.y)
        context.beginPath()
        context.lineWidth = state.size
        context.lineCap = 'round'
        context.strokeStyle = state.color

        return { ...state, isDragging: true }
      }

      case 'drag': {
        if (state.isDragging) {
          log('drag', action.payload)
          context.lineTo(action.payload.x, action.payload.y)
          context.stroke()
        }
        return state
      }

      case 'dragend': {
        if (state.isDragging) {
          log('dragend isDragging:', state.isDragging)
          const record = context.getImageData(
            0,
            0,
            state.dimensions.width,
            state.dimensions.height,
          )
          return {
            ...state,
            isDragging: false,
            history: [...state.history, record],
          }
        }
        return state
      }

      case 'save': {
        log('save', state.history.length)
        return {
          ...state,
          history: [
            ...state.history,
            context.getImageData(
              0,
              0,
              state.dimensions.width,
              state.dimensions.height,
            ),
          ],
        }
      }

      case 'undo': {
        log('undo', state.history.length)
        const history = [...state.history]
        history.pop()
        context.putImageData(history[history.length - 1], 0, 0)
        return { ...state, history }
      }

      default:
        return state
    }
  }
}

export const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>()
  const reducer = useRef(createCanvasReducer(ref))
  const [state, dispatch] = useReducer(reducer.current, defaultState)
  const useListeners = (
    broadcast: (action: CanvasAction) => void,
    isReady: boolean,
  ) => {
    useEffect(() => {
      if (isReady) {
        const canvas = ref.current
        const context = canvas.getContext('2d')
        const isTouchScreen = window.matchMedia('(hover: none)').matches
        const events = {
          start: isTouchScreen ? 'touchstart' : 'mousedown',
          move: isTouchScreen ? 'touchmove' : 'mousemove',
          end: isTouchScreen ? 'touchend' : 'mouseup',
        } as const
        const getPosition = (e: MouseEvent | TouchEvent) => {
          const { left, top } = canvas.getBoundingClientRect()
          const { clientX, clientY } =
            e instanceof MouseEvent ? e : e.touches[0]
          return { x: clientX - left, y: clientY - top }
        }

        context.fillStyle = state.bg
        context.fillRect(0, 0, state.dimensions.width, state.dimensions.height)
        broadcast({ type: 'save' })

        canvas.addEventListener(events.start, (e) => {
          broadcast({ type: 'dragstart', payload: getPosition(e) })
        })
        canvas.addEventListener(events.move, (e) => {
          broadcast({ type: 'drag', payload: getPosition(e) })
        })
        canvas.addEventListener(events.end, () => {
          broadcast({ type: 'dragend' })
        })
      }
    }, [isReady])
  }

  return { ...state, ref, dispatch, useListeners }
}
