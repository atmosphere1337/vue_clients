<template>
  <div class="user-card">
    <div style="display: flex">
      <img class="user-card-avatar" :src="targetUser.avatar"/>
      <div style="margin-left: 20px;">
        <div style="font-size: 36px;">
          {{ targetUser.first_name }}
          {{ targetUser.last_name }}
        </div>
        <div style="font-size: 24px;">
          {{ targetUser.email }}
        </div>
        <div class="user-card-rating-dock">
          <button @click="() => rating++">+</button>
          <div>{{ rating }} points</div>
          <button @click="() => rating--">-</button>
        </div>
        <div>
          <textarea placeholder="comment" v-model="comment" />
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <button class="user-card-save-button" @click="updateInfo">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
  import {ref, watch, defineProps} from 'vue'
  const props = defineProps(['targetUser']);
  const rating = ref('');
  const comment = ref('');
  const LOCAL_STORAGE_NAME = 'clientsInfo';

  watch(() => props.targetUser, () => {
    const ls = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_NAME)
    );
    const user = ls.find(client => client.id === props.targetUser.id);
    rating.value = user.rating;
    comment.value = user.comment;
  }, {immediate: true, deep: true})

  const updateInfo = () => {
    const ls = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_NAME)
    );
    const user = ls.find(client => client.id === props.targetUser.id);
    user.rating = rating.value;
    user.comment = comment.value;
    localStorage.setItem(
      LOCAL_STORAGE_NAME,
      JSON.stringify(ls)
    );
  }
</script>

<style>
  .user-card {
    width: 400px;
    height: 200px;
    border-radius: 20px;
    padding: 30px;
    background-color: white;
  }

  .user-card-avatar {
    height: 128px;
    width: 128px;
    border-radius: 15px;
    margin-top: 20px;
  }

  .user-card-rating-dock {
    display:flex;
    gap: 10px;
  }

  .user-card-save-button {
    background-color: #5555FF;
    padding: 5px 40px;
    border-radius: 5px;
    width: 100%;
    color: white;
  }
</style>
