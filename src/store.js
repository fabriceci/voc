import { create } from 'zustand'
import { createRef } from 'react'

export const useStore = create((set) => ({
  input: "",
  setInput: (value) => set({ input: value }),
  currentKey: "",
  setCurrentKey: (value) => set({ currentKey: value }),
  inputRef: createRef(null),
  setInputRef: (ref) => set({ inputRef: ref }),
  repeat: false,
  repeatCount: 0,
  setRepeatCount: (count) => set({ repeatCount: count }),
  hasError: false,
  setHasError: (error) => set({ hasError: error }),
  lackTilde: false,
  setLackTilde: (lack) => set({ lackTilde: lack }),
  show: false,
  setShow: (display) => set({ show: display }),
  wordToFound: [],
  setWordToFound: (world) => set({ wordToFound: world }),
  reset : () => set(state => ({
    input: "",
    repeatCount: 0,
    hasError: false,
    show: false,
    lackTilde: false,
  }))
}))