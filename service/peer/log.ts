const noop = () => {}
const hue = (name: string) => {
  switch (name) {
    case 'use-host':
      return 320
    case 'use-peer':
      return 220
    case 'use-room':
      return 180
  }
}

export const createLog = (name: string, level = 'log') => {
  return process.env.NODE_ENV === 'production'
    ? noop
    : (...content: JSONValue[]) => {
        console[level](
          `%c ${name} ▼`,
          `color: hsl(${hue(name)}, 66%, 33%)`,
          ...content,
        )
      }
}
