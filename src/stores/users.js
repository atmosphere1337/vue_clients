import { defineStore } from 'pinia';
import { saveLocalDataToBrowser, getLocalDataFromBrowser, removeLocalStorage } from '@/utils/localStorageService';
import { sortUserByRating, sortUsersBySecondName } from '@/utils/userSort';

export const useUserStore = defineStore('users', {
  state: () => {
    return  {
      apiUsers: [],
      localUsers: null,
      targetUser: null,
    }
  },
  getters: {
    getUserIds: (state) => state.apiUsers.map(user => user.id),
    getFullUsers: (state) => state.apiUsers.map(
      user => ({...user, ...state.localUsers.find((local) => local.id === user.id)})
    ),
  },
  actions: {
    syncTargetUserWith(listMode) {
      const {id, rating, comment} = this.targetUser;
      this.localUsers .forEach((localUser, index) => {
        if (localUser.id === id) {
          this.localUsers[index] = {id, rating, comment} ;
          if (listMode === 'rating') {
            this.apiUsers = sortUserByRating(this.getFullUsers);
          }
          saveLocalDataToBrowser(this.localUsers);
        }
      })
    },
    syncBrowserDataAndState() {
      this.localUsers = getLocalDataFromBrowser();

      const browserData = getLocalDataFromBrowser()
      if (browserData === undefined || browserData === null) {
        saveLocalDataToBrowser(
          this.apiUsers.map(user => ({id: user.id, rating: 0, comment: ''}))
        );
      }
      if (this.localUsers === null) {
        this.localUsers = getLocalDataFromBrowser();
        return;
      } 
      else {
        for (const item of this.apiUsers) {
          if (!this.getUserIds.find((id) => id === item.id)) {
            this.localUsers.push(
              {id: item.id, rating: 0, comment: ''}
            );
          }
        }
        saveLocalDataToBrowser(this.localUsers);
      }
    },
    sortUsers(listMode) {
      this.apiUsers = (listMode === 'clients')
        ? sortUsersBySecondName(this.apiUsers)
        : sortUserByRating(this.getFullUsers);
    },
    resetLocalStorage() {
      this.localUsers = removeLocalStorage(this.localUsers)
    }
  }
});