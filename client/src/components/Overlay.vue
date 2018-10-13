<template>
  <transition name="modal">
  <div class="overlay-outer-container">
    <template v-if="type === 'COMMENTS'">
      <commentAdder></commentAdder>
    </template>
    <template v-if="type === 'LINKS'">
      <linkAdder></linkAdder>
    </template>
  </div>
  </transition>
</template>
<script>
import CommentAdder from './CommentAdder';
import LinkAdder from './LinkAdder';

export default {
  name: 'overlay',
  props: {},
  components: {
    commentAdder: CommentAdder,
    linkAdder: LinkAdder,
  },
  data() {
    return {}
  },
  created() {
    document.addEventListener('keyup', (evt) => {
      // ESCAPE
      if (evt.keyCode === 27)  {
        this.$store.commit('CLOSE_OVERLAY');
      }
    })
  },
  computed: {

    type() {
      return this.$store.state.overlay.type;
    }

  },
  methods: {},
}
</script>
<style scoped>
.overlay-outer-container >>> .outer-container {
  position:fixed;
  top: 60px;
  right: 120px;
  bottom: 60px;
  left: 120px;
  border: 3px solid black;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 2px 2px #9e9e9e;
  background: white;
  opacity: 0.9;
  transition: all .3s ease;

}
.overlay-outer-container >>> .content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.overlay-outer-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: #bcbcbc40;
  transition: opacity .3s ease;
}

.close-button {
  font-size: 40px;
  position: fixed;
  top: 20px;
  right: 20px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
