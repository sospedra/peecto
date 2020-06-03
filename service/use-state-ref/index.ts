import {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from 'react'

export const useStateRef = <T>(
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] => {
  const [value, setValue] = useState<T>(initialValue)

  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return [value, setValue, ref]
}
