<template>
  <div id="container" style="display: flex; height: 100vh">
    <div id="sidebar" v-show="showSidebar" style="width: 300px; border: solid; display: flex; flex-direction: column; padding: 10px; ">
      <div style="display: flex; flex-direction: column; gap: 15px">
        <div id="clients-rating-toggle" style="color: black; border: solid">
          <button style="width: 50%; background-color: gray;" @click="() => listMode = 'clients'">Clients</button>
          <button style="width: 50%" @click="() => listMode = 'rating'">Rating</button>
        </div>
        <SearchBar
          v-if="listMode === 'clients'"
          :users="users"
          @onUserFoundEvent="userFoundEvent"
        />
        <div style="display: flex; flex-direction: column; gap: 5px">
          <UserTab
            v-for="user in users"
            :key="user.id"
            :user="user"
            :listMode="listMode"
            :rating="localDataState.find(localUserInfo => localUserInfo.id === user.id).rating"
            @onUserFoundEvent="getUserById"
          />
        </div>
      </div>
      <div id="sidebar-bottom" style="display: flex; flex-direction: column; gap: 10px; margin-top: auto">
        <button style="background-color: blue; padding: 5px 0px; border-radius: 5px;">
          Update list
        </button>
        <button style="background-color: orange; padding: 5px 0px; border-radius: 5px;" @click="removeLocalStorage()">
          Reset localStorage
        </button>
      </div>
    </div>
    <div id="hide-reveal-sidebar">
      <div>
        <button @click="showSidebar = !showSidebar">
          <font-awesome-icon icon="fa-angle-left" v-if="showSidebar"/>
          <font-awesome-icon icon="fa-angle-right" v-else />
        </button>
      </div>
    </div>
    <div id="main" style="display: flex; flex: 1; align-items: center; justify-content: center;">
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
    console.log(localStorage.getItem(LOCAL_STORAGE_NAME));
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

<style scoped>
  button {
    cursor: pointer;
  }
</style>
