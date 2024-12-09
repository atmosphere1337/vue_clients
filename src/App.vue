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
          :users="users"
          @onUserFoundEvent="userFoundEvent"
        />
      </div>
      <div id="user-tab-container">
        <UserTab
          v-for="user in users"
          :key="user.id"
          :user="user"
          :listMode="listMode"
          :rating="localDataState.find(localUserInfo => localUserInfo.id === user.id).rating"
          @onUserFoundEvent="getUserById"
        />
      </div>
      <div id="app-sidebar-footer">
        <button id="sidebar-update-list-button" class="blue-button">
          Update list
        </button>
        <button id="sidebar-reset-storage-button" class="blue-button" @click="removeLocalStorage()">
          Reset localStorage
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
      <UserCard v-if="targetUser" :targetUser="targetUser" />
    </div>
  </div>
</template>

<script setup>
  import { watch, computed, ref } from 'vue';
  import UserCard from './components/UserCard.vue'
  import SearchBar from './components/SearchBar.vue';
  import UserTab from './components/UserTab.vue';
  const LOCAL_STORAGE_NAME = 'clientsInfo'
  const showSidebar = ref(true);
  const listMode = ref('clients'); 
  const users = ref([]);
  const localDataState = ref(null);
  const targetUser = ref(false);
  const getAllUsers = () => {
    fetch('https://reqres.in/api/users/')
      .then((response) => response.json())
      .then(json => {
        users.value = json.data;
        syncStateWithLocalStorage();
        sortUsersBySecondName();
      })
      .catch('something went wrong');
  } 

  const userIds = computed(
    () => users.value.map(user => user.id)
  );

  watch(listMode, (newMode) => {
    if (newMode === 'clients') {
      sortUsersBySecondName();
    } else {
      sortUserByRating();
    }
  });

  const getUserById = (id) => {
    const identifiedUser = users.value.find(user => id === user.id);
    if (identifiedUser) {
      userFoundEvent(identifiedUser);
    }
  }

  const userFoundEvent = (identifiedUser) => {
    targetUser.value = identifiedUser;
    const ratingUser = localDataState.value.find(user => user.id === targetUser.value.id);
    targetUser.value.comment = ratingUser.comment;
    targetUser.value.rating = ratingUser.rating;
  }

  const syncStateWithLocalStorage = () => {
    if (JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) == undefined) {
      localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(
          users.value.map(user => ({id: user.id, rating: 0, comment: ''}))
        )
      );
    }
    if (localDataState.value === null) {
      localDataState.value = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME)
      );
      return;
    } 
    else {
      for (const item of users.value) {
        if (!userIds.value.find((id) => id === item.id)) {
          localDataState.value.push(
            {id: item.id, rating: 0, comment: ''}
          );
          localStorage.setItem(
            LOCAL_STORAGE_NAME,
            JSON.stringify(
              localDataState.value
            )
          );
        }
      }
    }
  }

  const removeLocalStorage = () => {
    localDataState.value = null;
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
