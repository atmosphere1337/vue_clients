<template>
  <div class="user-card">
    <div style="display: flex">
      <img class="user-card-avatar" :src="userStore.targetUser.avatar"/>
      <div id="user-card-text-info">
        <div style="font-size: 36px;">
          {{ userStore.targetUser.first_name }}
          {{ userStore.targetUser.last_name }}
        </div>
        <div style="font-size: 24px;">
          {{ userStore.targetUser.email }}
        </div>
        <div class="user-card-rating-dock">
          <button @click="() => userStore.targetUser.rating--">-</button>
          <div>{{ userStore.targetUser.rating }} points</div>
          <button @click="() => userStore.targetUser.rating++">+</button>
        </div>
        <div>
          <textarea id="comment-field" placeholder="comment" v-model="userStore.targetUser.comment" />
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <button class="user-card-save-button blue-button" @click="saveUser">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
  import {defineProps } from 'vue'
  import { useUserStore } from '@/stores/users';
  const userStore = useUserStore();

  const props = defineProps(['listMode']);

  const saveUser = () => {
    userStore.syncTargetUserWith(props.listMode);
  }
</script>

<style>
  .user-card {
    min-width: 480px;
    box-sizing: border-box;
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
