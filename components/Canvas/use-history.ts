import { useRef, MutableRefObject } from 'react'

export const useHistory = (canvasRef: MutableRefObject<HTMLCanvasElement>) => {
  const history = useRef([])
  const save = () => {
    const context = canvasRef.current.getContext('2d')
    history.current.push(context.getImageData(0, 0, 500, 500))
  }
  const peak = () => {
    return history.current[history.current.length - 1]
  }
  const pop = () => {
    history.current.pop()
    return peak()
  }

  return { save, pop, peak }
}
