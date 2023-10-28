import { InitialStateType, GlobalStateType, ActionType } from "./global-state";

export const darkModeReducer = (
  state: InitialStateType,
  action: ActionType
): boolean => {
  switch (action.type) {
    case GlobalStateType.EnableDarkMode:
      return action.payload.darkMode;
    default:
      return state.darkMode;
  }
};
