<template>
  <div class="user-tab">
    <div class="user-tab" @click="$emit('onUserFoundEvent', user)" >
      <div v-if="props.listMode === 'clients'">
        <img class="user-tab-avatar" :src="props.user.avatar" />
      </div>
      <div class="user-tab-rating" v-else>
        {{ user.rating}}
      </div>
      <div>
        {{ user.first_name }}
        {{ user.last_name }}
      </div>
      <div class="user-tab-right-arrow arrow-color">
        <font-awesome-icon icon="fa-angle-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  const props = defineProps(['user', 'listMode']);
</script>

<style>
  .user-tab {
    display: flex;
    width: 100%;
    gap: 12px;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
  }

  .user-tab-avatar {
    height: 36px;
    width: 36px;
    border-radius: 100px;
  }

  .user-tab-rating {
    height: 36px;
    width: 36px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-tab-right-arrow {
    margin-left: auto;
    padding: 0px 15px;
  }
</style>