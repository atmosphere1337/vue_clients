<template>
  <div class="user-tab">
    <div class="user-tab" @click="$emit('onUserFoundEvent', props.user.id)" >
      <div v-if="props.listMode === 'clients'">
        <img class="user-tab-avatar" :src="props.user.avatar" />
      </div>
      <div class="user-tab-rating" v-else>
        {{ props.rating}}
      </div>
      <div>
        {{ user.first_name }}
        {{ user.last_name }}
      </div>
      <div class="user-tab-right-arrow">
        <font-awesome-icon icon="fa-angle-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';
  const props = defineProps(['user', 'rating', 'listMode']);
</script>

<style scoped>
  .user-tab {
    display: flex;
    gap: 12px;
    align-items: center;
    border-radius: 10px;
  }

  .user-tab:hover { background-color: #BBBBBB; }

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