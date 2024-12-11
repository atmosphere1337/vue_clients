const LOCAL_STORAGE_NAME = 'clientsInfo';

export const saveLocalDataToBrowser = (localState) => {
    localStorage.setItem(
      LOCAL_STORAGE_NAME,
      JSON.stringify(
        localState
      )
    );
  }

export const getLocalDataFromBrowser = () => {
      return JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME)
      );
  }

export const removeLocalStorage = (localState) => {
  localStorage.removeItem(LOCAL_STORAGE_NAME);
  return localState.map(user => ({id: user.id, rating: 0, comment: ''}));
}