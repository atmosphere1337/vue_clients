<template>
  <div class="user-card">
    <div style="display: flex">
      <img class="user-card-avatar" :src="targetUser.avatar"/>
      <div id="user-card-text-info">
        <div style="font-size: 36px;">
          {{ targetUser.first_name }}
          {{ targetUser.last_name }}
        </div>
        <div style="font-size: 24px;">
          {{ targetUser.email }}
        </div>
        <div class="user-card-rating-dock">
          <button @click="() => rating--">-</button>
          <div>{{ rating }} points</div>
          <button @click="() => rating++">+</button>
        </div>
        <div>
          <textarea id="comment-field" placeholder="comment" v-model="comment" />
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <button class="user-card-save-button blue-button" @click="updateInfo">
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
    min-width: 400px;
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

  #user-card-text-info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 8px;
    margin-left: 20px;
  }

  .user-card-rating-dock {
    width: 100%;
    justify-content: space-between;
    display:flex;
    gap: 10px;
  }

  #comment-field {
    width: 100%;
    height: 80px;
    resize: none;
  }

  .user-card-save-button {
    padding: 5px 40px;
    width: 100%;
  }
</style>
