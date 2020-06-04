import React, { useRef, useEffect, useState } from 'react'
import { ChatAction } from 'service/peer/use-chat'
import { useHistory } from './use-history'

const Canvas: React.FC<{
  broadcast: (action: ChatAction) => void
}> = (props) => {
  const ref = useRef<HTMLCanvasElement>()
  const isMouseDown = useRef(false)
  const history = useHistory(ref)
  const [config, setConfig] = useState({
    size: 5,
    color: 'black',
    bg: '#fabada',
  })

  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d')
    const getMousePosition = (e: MouseEvent): [number, number] => {
      const { left, top } = canvas.getBoundingClientRect()
      return [e.clientX - left, e.clientY - top]
    }
    const mousedown = (e: MouseEvent) => {
      isMouseDown.current = true
      context.moveTo(...getMousePosition(e))
      context.beginPath()
      context.lineWidth = config.size
      context.lineCap = 'round'
      context.strokeStyle = config.color
    }
    const mousemove = (e: MouseEvent) => {
      if (isMouseDown.current) {
        context.lineTo(...getMousePosition(e))
        context.stroke()
      }
    }
    const mouseup = () => {
      if (isMouseDown.current) {
        history.save()
        isMouseDown.current = false
      }
    }

    context.fillStyle = config.bg
    context.fillRect(0, 0, canvas.width, canvas.height)
    history.save()
    canvas.addEventListener('mousedown', mousedown)
    canvas.addEventListener('mousemove', mousemove)
    canvas.addEventListener('mouseup', mouseup)
  }, [])

  return (
    <div>
      <canvas ref={ref} width={500} height={500} />
      <button
        onClick={() => {
          const context = ref.current.getContext('2d')
          context.putImageData(history.pop(), 0, 0)
        }}
      >
        undo
      </button>
    </div>
  )
}

export default Canvas
