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
          v-for="fullUser in userStore.getFullUsers"
          :key="fullUser.id"
          :user="fullUser"
          :listMode="listMode"
        />
      </div>
      <div id="app-sidebar-footer">
        <button id="sidebar-update-list-button" class="blue-button" @click="getAllUsers">
          Reload list
        </button>
        <button
          id="sidebar-reset-storage-button"
          class="blue-button"
          @click="userStore.resetLocalStorage"
        >
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
    <div
      id="app-main"
      :class="{'app-main-hidable': userStore.targetUser == null, 'app-main-not-hidable': userStore.targetUser != null, 'app-background-color': true}"
    >
      <UserCard v-if="userStore.targetUser != null" :listMode="listMode" />
    </div>
  </div>
</template>

<script setup>
  import { watch, ref } from 'vue';
  import UserCard from './components/UserCard.vue'
  import SearchBar from './components/SearchBar.vue';
  import UserTab from './components/UserTab.vue';
  import validateApiResponse from './utils/validateApiResponse';
  const showSidebar = ref(true);
  const listMode = ref(null); 

  import { useUserStore } from './stores/users'; 
  const userStore = useUserStore();

  const getAllUsers = () => {
    fetch('https://reqres.in/api/users/')
      .then((response) => response.json())
      .then(json => {
        validateApiResponse(json);

        userStore.apiUsers = json.data;
        userStore.syncBrowserDataAndState();
        listMode.value = 'clients';
      })
      .catch(alert);
  } 
  getAllUsers();

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 800) {
      showSidebar.value = true;
    }
  });

  watch(listMode, (newListMode) => userStore.sortUsers(newListMode));

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
