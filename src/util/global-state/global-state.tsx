import React, { createContext, useReducer, Dispatch } from 'react';
import { darkModeReducer } from './reducers';

export type InitialStateType = {
  darkMode: boolean;
}

export enum GlobalStateType {
  EnableDarkMode = "ENABLE_DARK_MODE",
}


export interface ActionType {
  type: GlobalStateType;
  payload: InitialStateType;
}

const initialState = {
  darkMode: false,
}

const GlobalState = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = (state: InitialStateType, action: ActionType): InitialStateType => ({
  darkMode: darkModeReducer(state, action),
});


const GlobalStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <GlobalState.Provider value={{state, dispatch}}>
      {children}
    </GlobalState.Provider>
  )
}

export { GlobalStateProvider, GlobalState };