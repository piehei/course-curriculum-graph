
<template>
  <div class="overlay-outer-container">
    <button class="close-button"
            @click="close">
      X
    </button>

    <h1><center>You're adding a new {{ adderType }}</center></h1>

  </div>
</template>
<script>
export default {
  name: 'overlay',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    adderType: {
      type: String,
      required: true,
    }
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {

    close() {
      this.$emit('update:show', false);
    },

  },
}
</script>
<style scoped>

.overlay-outer-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  opacity: 0.90;
  background: #9e9e9e;
}

.close-button {
  font-size: 40px;
  position: fixed;
  top: 20px;
  right: 20px;
}

</style>
