// Functions that produce calculated values given a state.
//

export function neverMarried(state) {
  return state.veteran.maritalStatus === '' ||
    state.veteran.maritalStatus === 'Never Married';
}
