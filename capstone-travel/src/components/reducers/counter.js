export const counter = (state = 0 , action) => {
  switch(action.type) {
    case "ADD_COUNT":
      return state + 1
    default:
      return state
  }
}