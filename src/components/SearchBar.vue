<template>
  <div style="position: relative">
    <div style="display: flex; gap: 3px; padding: 7px; background-color: #DDDDDD; border-radius: 10px;">
    <input
      placeholder="Enter username to search"
      v-model="usernameToSearch"
      style="width: 100%; font-size: 18px; border: none; outline: none"
    />
    <div style="display: flex; align-items: center; justify-content: center;">
      <font-awesome-icon icon="fa-magnifying-glass" />
    </div>
    </div>
    <div v-if="showSearchOptions" style="position: absolute; border: solid; background-color: red; width: 100%">
    <div v-for="user in usersFound" :key="user.id" @click="selectFoundUser(user.first_name, user.last_name)">
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
    if (usernameToSearch.value === '') {
      showSearchOptions.value = false;
    } else {
      showSearchOptions.value = true;
    }

    const identifiedUser = props.users.find(user => username === `${user.first_name} ${user.last_name}`)
    if (identifiedUser) {
      emit('onUserFoundEvent', identifiedUser);
      showSearchOptions.value = false;
    }
  });

</script>