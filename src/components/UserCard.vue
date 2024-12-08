<template>
  <div class="user-card" style="border: solid; width: 400px; height: 200px; border-radius: 20px; padding: 30px">
    <div style="display: flex">
      <img :src="targetUser.avatar" style="height: 128px; width: 128px; border-radius: 15px; margin-top: 20px;"/>
      <div style="margin-left: 20px;">
        <div style="font-size: 36px;">
          {{ targetUser.first_name }}
          {{ targetUser.last_name }}
        </div>
        <div style="font-size: 24px;">
          {{ targetUser.email }}
        </div>
        <div style="display:flex; gap: 10px">
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
      <button
        @click="updateInfo"
        style="background-color: #5555FF; padding: 5px 40px; border-radius: 5px; width: 100%; color: white"
      >
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