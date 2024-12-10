<template>
  <div style="position: relative">
    <div id="search-bar-input-and-icon">
      <input id="search-bar-input" placeholder="Enter username to search" v-model="usernameToSearch"/>
      <div id="search-bar-icon">
        <font-awesome-icon icon="fa-magnifying-glass" />
      </div>
    </div>
    <div id="search-bar-dropdown-list" v-if="showSearchOptions">
      <div
        v-for="user in usersFound"
        :key="user.id"
        @click="selectFoundUser(user.first_name, user.last_name)"
      >
        {{ `${user.first_name} ${user.last_name}` }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed, defineProps, watch, defineEmits} from 'vue';
  const usernameToSearch = ref('');
  const showSearchOptions = ref(false);
  const props = defineProps(['users']);
  const emit = defineEmits(['onUserFoundEvent']);

  const usersFound = computed(() => 
    props.users.filter(
      user => `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(usernameToSearch.value.toLowerCase())
    )
  );

  const selectFoundUser = (firstName, lastName) => {
    usernameToSearch.value = `${firstName} ${lastName}`;
    showSearchOptions.value = false;
  }

  watch(usernameToSearch, (username) => {
    showSearchOptions.value = usernameToSearch.value !== '';

    const identifiedUser = props.users.find(user => username === `${user.first_name} ${user.last_name}`)
    if (identifiedUser) {
      emit('onUserFoundEvent', identifiedUser);
      showSearchOptions.value = false;
    }
  });

</script>

<style>
  #search-bar-input-and-icon {
    display: flex;
    gap: 3px;
    padding: 7px;
    background-color: white;
    border-radius: 10px;
  }

  #search-bar-input {
    width: 100%;
    font-size: 18px;
    border: none;
    outline: none
  }

  #search-bar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #search-bar-dropdown-list {
    position: absolute;
    background-color: white;
    width: 100%
  }
</style>