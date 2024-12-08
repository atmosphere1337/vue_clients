<template>
  <div class="user-tab">
    <div
      @click="$emit('onUserFoundEvent', props.user.id)"
      style="display: flex; gap: 12px; border: solid; align-items: center; border-radius: 10px;"
    >
      <div v-if="props.listMode === 'clients'">
        <img :src="props.user.avatar" style="height: 36px; width: 36px; border-radius: 100px;" />
      </div>
      <div v-else style="height: 36px; width: 36px; font-size: 24px; display: flex; align-items: center; justify-content: center;">
        {{ props.rating}}
      </div>
      <div>
        {{ user.first_name }}
        {{ user.last_name }}
      </div>
      <div style="margin-left: auto; padding: 0px 15px;" >
        <font-awesome-icon icon="fa-angle-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';
  const props = defineProps(['user', 'rating', 'listMode']);
</script>