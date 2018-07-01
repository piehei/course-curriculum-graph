
<template>
  <div class="overlay-outer-container">
    <button class="close-button"
            @click="close">
      X
    </button>

    <h1><center>You're adding a new {{ type }}</center></h1>

    <commentAdder></commentAdder>

  </div>
</template>
<script>
import CommentAdder from './CommentAdder';

export default {
  name: 'overlay',
  props: {},
  components: {
    commentAdder: CommentAdder,
  },
  data() {
    return {}
  },
  created() {},
  computed: {

    type() {
      return this.$store.state.overlay.type;
    }

  },
  methods: {

    close() {
      this.$store.commit('CLOSE_OVERLAY');
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
  opacity: 0.95;
  background: #9e9e9e;
}

.close-button {
  font-size: 40px;
  position: fixed;
  top: 20px;
  right: 20px;
}

</style>
