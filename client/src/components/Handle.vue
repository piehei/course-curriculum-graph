
<template>
  <rect id="drag-rect"
       ref="dragRect"
       :width="width"
       :height="height"
       fill="white"
       :x="dragRectX" :y="dragRectY">
  <!-- <font-awesome-icon :icon="icon" size="lg" :transform="{ rotate: 45 }"></font-awesome-icon> -->
  </rect>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faArrowsAlt from '@fortawesome/fontawesome-free-solid/faArrowsAlt'

export default {
  name: 'handle',
  props: {
    id: {
      type: String,
      required: true,
    },
    dragRectX: {
      type: Number,
      required: true,
    },
    dragRectY: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    currX: {
      type: Number,
      required: true,
    },
    currY: {
      type: Number,
      required: true,
    }
  },
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      icon: faArrowsAlt,
      lastMousePos: {
        x: 0,
        y: 0,
      },
    }
  },
  mounted() {

    const drag = this.$refs['dragRect'];

    drag.addEventListener('click', (evt) => {
      evt.stopPropagation(); // prevents appearing on App.vue

      if (this.deleteMode) {
        this.$store.commit('DELETE_ITEM', {
          type: 'node',
          id: this.id
        })
        return;
      }

      if (!evt.ctrlKey) return;
      this.$store.commit('CONNECTION_ADDING_CLICK', this.id);
    });

    drag.addEventListener('mousedown', (mouseDownEvt) => {
      this.lastMousePos.x = mouseDownEvt.clientX;
      this.lastMousePos.y = mouseDownEvt.clientY;

      // since mousedown is called at click events
      // keep track of if any movement happened or if the user
      // only added a new connection
      let HAS_MOVED = false;

      // this is called at every mouse movement event
      // this updates the location of the course element
      // to the current mouse location
      const mouseMoveHandler = (evt) => {
        if (evt.clientY < 35) {
          return;
        }

        const deltaX = evt.clientX - this.lastMousePos.x;
        const deltaY = evt.clientY - this.lastMousePos.y;
        //if (Math.abs(deltaX) < 4 || Math.abs(deltaY) < 4) return;

        this.lastMousePos.x = evt.clientX;
        this.lastMousePos.y = evt.clientY;

        const newX = this.currX + deltaX;
        const newY = this.currY + deltaY;
        this.$emit('update:localX', newX)
        this.$emit('update:localY', newY)

        this.$store.commit('MOVE_OBJECT_TO', {
          objectId: this.id,
          newX: newX,
          newY: newY }
        );

        HAS_MOVED = true;

      }

      window.addEventListener('mousemove', mouseMoveHandler);

      // removes this course component's global mouse movement
      // event listeners after mouseup event and commits the final
      // location to userLog so that timetravel includes node movements
      const mouseUpHandler = () => {

        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);

        if (HAS_MOVED) {
          this.$store.commit('SAVE_NODE_LOC_TO_USERLOG', {
            id: this.id,
            x: this.currX,
            y: this.currY,
          });
        }
      };

      window.addEventListener('mouseup', mouseUpHandler);
    });
  },
  computed: {
    deleteMode() {
      return this.$store.state.UI.deleteMode;
    }
  },
  methods: {},
}
</script>
<style scoped>

#drag-rect {
  cursor: move;
  pointer-events: bounding-box;
}

</style>
