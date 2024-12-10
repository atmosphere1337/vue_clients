<template>
  <div id="app-container">
    <div id="app-sidebar" v-show="showSidebar">
      <div id="app-sidebar-header" class="sidebar-secondary-color">
        <div id="clients-view-toggle">
          <button
            :class="{'clients-view-toggle-button': true, 'toggle-view-button-active': listMode == 'clients'}"
            @click="() => listMode = 'clients'"
          >
            Clients
          </button>
          <button
            :class="{'clients-view-toggle-button': true, 'toggle-view-button-active': listMode == 'rating'}"
            @click="() => listMode = 'rating'"
          >
            Rating
          </button>
        </div>
        <SearchBar
          v-if="listMode === 'clients'"
        />
      </div>
      <div id="user-tab-container">
        <UserTab
          v-for="fullUser in fullUsers"
          :key="fullUser.id"
          :user="fullUser"
          :listMode="listMode"
          @onUserFoundEvent="userFoundEvent"
        />
      </div>
      <div id="app-sidebar-footer">
        <button id="sidebar-update-list-button" class="blue-button" @click="getAllUsers">
          Reload list
        </button>
        <button
          id="sidebar-reset-storage-button"
          class="blue-button"
          @click="() => {localDataState = removeLocalStorage(localDataState)}"
        >
          Clear localStorage variable
        </button>
        <div v-for="usr in userStore.apiUsers" :key="usr.id">{{ usr.first_name }}</div>
      </div>
    </div>
    <div id="hide-reveal-sidebar" class="app-background-color">
      <button id="hide-reveal-button" class="sidebar-secondary-color arrow-color" @click="showSidebar = !showSidebar">
        <font-awesome-icon icon="fa-angle-left" v-if="showSidebar"/>
        <font-awesome-icon icon="fa-angle-right" v-else />
      </button>
    </div>
    <div
      id="app-main"
      :class="{'app-main-hidable': targetUserId == null, 'app-main-not-hidable': targetUserId != null, 'app-background-color': true}"
    >
      <UserCard v-if="targetUser" :targetUser="targetUser" @onUserSave="userFoundEvent" />
    </div>
  </div>
</template>

<script setup>
  import { watch, computed, ref } from 'vue';
  import UserCard from './components/UserCard.vue'
  import SearchBar from './components/SearchBar.vue';
  import UserTab from './components/UserTab.vue';
  import validateApiResponse from './utils/validateApiResponse';
  import { saveLocalDataToBrowser, getLocalDataFromBrowser, removeLocalStorage} from './utils/localStorageService';
  import { sortUserByRating, sortUsersBySecondName } from './utils/userSort';
  const showSidebar = ref(true);
  const listMode = ref('clients'); 
  // const users = ref([]);
  const targetUserId = ref(null);
  const localDataState = ref(null);


  import { useUserStore } from './stores/users'; 
  const userStore = useUserStore();

  const getAllUsers = () => {
    fetch('https://reqres.in/api/users/')
      .then((response) => response.json())
      .then(json => {
        validateApiResponse(json);

        userStore.apiUsers = json.data;
        userStore.syncBrowserDataAndState();

        // users.value = json.data;
        // syncBrowserDataAndState();
        listMode.value = 'clients';
      })
      .catch(alert);
  } 
  getAllUsers();

  window.addEventListener('resize', () => {
    if (window.screen.width <= 800) {
      showSidebar.value = true;
    }
  });

  // const fullUsers = computed(() => {
  //   return users.value.map(
  //     user => ({...user, ...localDataState.value.find((local) => local.id === user.id)})
  //   )
  // });

  // const userIds = computed(
  //   () => users.value.map(user => user.id)
  // );

  // const targetUser = computed({
  //   get() {
  //     return fullUsers.value.find((user) => user.id === targetUserId.value);
  //   },
  //   set({id, rating, comment}) {
  //     localDataState.value.forEach((localUser, index) => {
  //       if (localUser.id === id) {
  //         localDataState.value[index] = {id, rating, comment} ;
  //         if (listMode.value === 'rating') {
  //           users.value = sortUserByRating(fullUsers.value);
  //         }
  //         saveLocalDataToBrowser(localDataState.value);
  //       }
  //     })
  //   },
  // });

  // const sortUsers = (mode) => {
  //   users.value = (mode === 'clients')
  //     ? sortUsersBySecondName(users.value)
  //     : sortUserByRating(fullUsers.value);
  // }

  // watch(listMode, sortUsers);
  watch(listMode, () => userStore.sortUsers(listMode.value));

  // const userFoundEvent = (identifiedUser) => {
  //   targetUserId.value = identifiedUser.id;
  //   targetUser.value = identifiedUser;
  // }

  // const syncBrowserDataAndState = () => {
  //   const browserData = getLocalDataFromBrowser()
  //   if (browserData === undefined || browserData === null) {
  //     saveLocalDataToBrowser(
  //       users.value.map(user => ({id: user.id, rating: 0, comment: ''}))
  //     );
  //   }
  //   if (localDataState.value === null) {
  //     localDataState.value = getLocalDataFromBrowser();
  //     return;
  //   } 
  //   else {
  //     for (const item of users.value) {
  //       if (!userIds.value.find((id) => id === item.id)) {
  //         localDataState.value.push(
  //           {id: item.id, rating: 0, comment: ''}
  //         );
  //       }
  //     }
  //     saveLocalDataToBrowser(localDataState.value);
  //   }
  // }
  
</script>

<style>
  #app-container {
    display: flex;
    height: 100vh;
  }

  #app-sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  #app-sidebar > div:not(:first-child) {
    padding: 10px;
  }

  #app-sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
  }

  #clients-view-toggle {
    border-radius: 35px;
    overflow: hidden;
  }

  .clients-view-toggle-button {
    width: 50%;
    border: none;
    padding: 10px;
    background-color: #d3e1ea;
  }

  .toggle-view-button-active {
    background-color: white;
    color: black;
  }

  #user-tab-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  #app-sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
  }

  #sidebar-update-list-button {
    
  }

  #sidebar-reset-storage-button {
    background-color: rgb(222, 125, 68);
  }

  #hide-reveal-sidebar {
    padding-right: 10px;
  }

  #hide-reveal-button {
    margin-top: 8px;
    padding: 12px 3px;
    border: none;
    border-radius: 0px 5px 5px 0px;
    box-shadow: 3px 0px 3px 3px #777777;
  }

  .app-main-hidable, .app-main-not-hidable {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  button {
    cursor: pointer;
  }
</style>
