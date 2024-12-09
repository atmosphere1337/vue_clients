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
          :users="fullUsers"
          @onUserFoundEvent="userFoundEvent"
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
        <button id="sidebar-reset-storage-button" class="blue-button" @click="removeLocalStorage()">
          Clear localStorage variable
        </button>
      </div>
    </div>
    <div id="hide-reveal-sidebar" class="app-background-color">
      <button id="hide-reveal-button" class="sidebar-secondary-color arrow-color" @click="showSidebar = !showSidebar">
        <font-awesome-icon icon="fa-angle-left" v-if="showSidebar"/>
        <font-awesome-icon icon="fa-angle-right" v-else />
      </button>
    </div>
    <div id="app-main" class="app-background-color">
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
  const LOCAL_STORAGE_NAME = 'clientsInfo'
  const showSidebar = ref(true);
  const listMode = ref('clients'); 
  const users = ref([]);
  const targetUserId = ref(null);
  const localDataState = ref(null);
  const getAllUsers = () => {
    fetch('https://reqres.in/api/users/')
      .then((response) => response.json())
      .then(json => {
        validateApiResponse(json);
        users.value = json.data;
        syncBrowserDataAndState();
        sortUsers(listMode.value);
      })
      .catch(alert);
  } 

  const fullUsers = computed(() => {
    return users.value.map(
      user => ({...user, ...localDataState.value.find((local) => local.id === user.id)})
    )
  });

  const userIds = computed(
    () => users.value.map(user => user.id)
  );

  const targetUser = computed({
    get() {
      return fullUsers.value.find((user) => user.id === targetUserId.value);
    },
    set({id, rating, comment}) {
      localDataState.value.forEach((localUser, index) => {
        if (localUser.id === id) {
          localDataState.value[index] = {id, rating, comment} ;
          if (listMode.value === 'rating') {
            sortUserByRating();
          }
          saveLocalDataToBrowser(localDataState.value);
        }
      })
    },
  });

  const sortUsers = (mode) => {
    if (mode === 'clients') {
      sortUsersBySecondName();
    } else {
      sortUserByRating();
    }
  }

  watch(listMode, sortUsers);

  const userFoundEvent = (identifiedUser) => {
    targetUserId.value = identifiedUser.id;
    targetUser.value = identifiedUser;
  }

  const syncBrowserDataAndState = () => {
    const browserData = getLocalDataFromBrowser()
    if (browserData === undefined || browserData === null) {
      console.log(users.value.map(user => ({id: user.id, rating: 0, comment: ''})));
      saveLocalDataToBrowser(
        users.value.map(user => ({id: user.id, rating: 0, comment: ''}))
      );
    }
    if (localDataState.value === null) {
      localDataState.value = getLocalDataFromBrowser();
      return;
    } 
    else {
      for (const item of users.value) {
        if (!userIds.value.find((id) => id === item.id)) {
          localDataState.value.push(
            {id: item.id, rating: 0, comment: ''}
          );
        }
      }
      saveLocalDataToBrowser(localDataState.value);
    }
  }

  const saveLocalDataToBrowser = (localState) => {
    localStorage.setItem(
      LOCAL_STORAGE_NAME,
      JSON.stringify(
        localState
      )
    );
  }

  const getLocalDataFromBrowser = () => {
      return JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME)
      );
  }

  const removeLocalStorage = () => {
    localDataState.value = localDataState.value.map(user => ({id: user.id, rating: 0, comment: ''}));
    localStorage.removeItem(LOCAL_STORAGE_NAME);
  }

  const sortUsersBySecondName = () => {
    users.value.sort(
      (a, b) => a.last_name.localeCompare(b.last_name)
    );
  }

  const sortUserByRating = () => {
    users.value.sort(
      (a, b) => localDataState.value.find(user => user.id === b.id).rating - localDataState.value.find(user => user.id === a.id).rating 
    );
  }

  getAllUsers();
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

  #app-main {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  button {
    cursor: pointer;
  }
</style>
