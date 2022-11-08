import { omit } from 'lodash'
import React, { useCallback, useContext } from 'react'
import { useLocalStorage } from 'react-use'
import { dictionaries, Dictionary } from 'resources/dictionary'

export type PronunciationType = 'us' | 'uk' | 'jap' | false

export type AppState = {
  /**
   * Whether the sound is enabled.
   */
  sound: boolean
  /**
   * Available dictionaries.
   * This field should not be written to `localStorage`.
   */
  dictionaries: Dictionary[]
  /**
   * The selected dictionary.
   */
  selectedDictionary: Dictionary
  /**
   * Which type of pronunciation is used.
   * Available options: `"us"`, `"uk"`, `"jap"`and `false`.
   */
  pronunciation: PronunciationType
  /**
   * The selected chapter number.
   */
  selectedChapter: number
  /**
   * Whether random word is enabled
   */
  random: boolean
  /**
   * Whether loop single word is enabled
   */
  loop: boolean
  /**
   * Whether show phonetic is enabled
   */
  phonetic: boolean
  /**
   * Whether dark mode is enabled
   */
  darkMode: boolean
  /**
   * loop play sound until word spells right
   */
  soundLoop: boolean
  /* *
   * 不透明度
   */
  不透明度: number
}

export type AppStateData = {
  state: AppState
  dispatch: (state: AppState) => void
}

const AppStateContext = React.createContext<AppStateData>({} as AppStateData)

/**
 * Get the global app state.
 */
export function useAppState(): AppState {
  const { state } = useContext(AppStateContext)
  return state
}

export function useSetSoundState(): [status: boolean, setSound: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setSound = useCallback((sound: boolean) => dispatch({ ...state, sound }), [state, dispatch])
  return [state.sound, setSound]
}

export function useRandomState(): [status: boolean, setRandom: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setRandom = useCallback((random: boolean) => dispatch({ ...state, random }), [state, dispatch])
  return [state.random, setRandom]
}

export function useSetLoopState(): [status: boolean, setLoop: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setLoop = useCallback((loop: boolean) => dispatch({ ...state, loop }), [state, dispatch])
  return [state.loop, setLoop]
}

export function useSetSoundLoopState(): [status: boolean, setLoop: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setSoundLoop = useCallback((soundLoop: boolean) => dispatch({ ...state, soundLoop }), [state, dispatch])
  return [state.soundLoop, setSoundLoop]
}

export function usePhoneticState(): [status: boolean, setPhonetic: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setPhonetic = useCallback((phonetic: boolean) => dispatch({ ...state, phonetic }), [state, dispatch])
  return [state.phonetic, setPhonetic]
}

/**
 * Use all available dictionaries.
 */
export function useDictionaries(): Dictionary[] {
  const { state } = useContext(AppStateContext)
  return state.dictionaries
}

export function useSetDictionary(): (id: string) => void {
  const { state, dispatch } = useContext(AppStateContext)
  return (id: string) => {
    const found = dictionaries.find((dict) => dict.id === id)
    if (found !== undefined) {
      dispatch({ ...state, selectedDictionary: found, selectedChapter: 0 })
    }
  }
}

/**
 * Use the current selected dictionary.
 */
export function useSelectedDictionary(): Dictionary {
  const { state } = useContext(AppStateContext)
  return state.selectedDictionary
}

export function useSetPronunciationState(): [status: PronunciationType, setPronunciation: (state: PronunciationType) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setPronunciation = useCallback((pronunciation: PronunciationType) => dispatch({ ...state, pronunciation }), [state, dispatch])
  return [state.pronunciation, setPronunciation]
}

/**
 * Use the current selected chapter.
 */
export function useSelectedChapter(): [number, (chapter: number) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  return [state.selectedChapter, (selectedChapter: number): void => dispatch({ ...state, selectedChapter })]
}

/**
 * Dark Mode
 */
export function useDarkMode(): [darkMode: boolean, setDarkMode: (state: boolean) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      dispatch({ ...state, darkMode })
      darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    },
    [state, dispatch],
  )

  return [state.darkMode, setDarkMode]
}

/**
 *
 * @returns [不透明度, 设置不透明度]
 */
export function useOpacity(): [不透明度: number, setOpacity: (state: number) => void] {
  const { state, dispatch } = useContext(AppStateContext)
  const 设置不透明度 = useCallback((不透明度: number) => dispatch({ ...state, 不透明度 }), [state, dispatch])

  return [state.不透明度, 设置不透明度]
}

const defaultState: AppState = {
  sound: true,
  dictionaries,
  selectedDictionary: dictionaries[0],
  pronunciation: 'us',
  selectedChapter: 0,
  random: false,
  loop: false,
  phonetic: true,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  soundLoop: false,
  不透明度: 1,
}

export const AppStateProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // 从 localStorage 中读取状态 (如果有的话)
  const 初始化应用状态 = 背单词 ? 初始化单词数据() : defaultState
  const [state, setState] = useLocalStorage<AppState>('state', 初始化应用状态, options)
  return <AppStateContext.Provider value={{ state: state!, dispatch: setState }}>{children}</AppStateContext.Provider>
}

const options = {
  raw: false,
  serializer(state: AppState): string {
    const 数据 = JSON.stringify(omit(state, 'dictionaries'))
    if (背单词) 背单词.写入数据(数据)
    return 数据
  },
  deserializer(source: string): AppState {
    const state: AppState = JSON.parse(source)
    state.dictionaries = dictionaries
    return state
  },
}

const 初始化单词数据 = () => {
  const 数据 = JSON.parse(背单词.读取数据()) as AppState

  // 如果没有数据，就返回默认数据
  return 数据 ? 数据 : defaultState
}

const 背单词 = (window as any).背单词 as {
  读取数据: () => string
  写入数据: (数据: string) => void
}
