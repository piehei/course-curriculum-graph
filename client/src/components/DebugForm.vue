<template>

    <div id="add-instructions">
      <input id="username" v-model="username" type="text">
      <label for="username">Username</label>
      <br>
      <!--
        <input id="date" v-model="date" type="date">
        <label for="date">Date</label>
      -->
      <button @click="saveDebugForm">Save debug</button>
    </div>

</template>
<script>
export default {
  data() {
    return {
      username: '',
    };
  },

  created() {
    this.username = this.storeUserName;
  },

  watch: {
    storeUserName(val) {
      this.username = val;
    },
  },

  computed: {
    storeUserName() {
      return this.$store.state.debug.username;
    },
    date: {
      get() {
        return this.$store.state.debug.date;
      },
      set(val) {
        this.$store.commit('DEBUG_SET_DATE', val);
      }
    },
  },

  methods: {
    saveDebugForm() {
      this.$store.dispatch('DEBUG_SET_USERNAME', this.username);
    }
  }

};
</script>
<style>
  #add-instructions {
    position: absolute;
    top: 10px;
    right: 120px;
    font-size: 12px;
  }
</style>

