<template>
  <rect id="drag-rect"
       ref="dragRect"
       :width="width"
       :height="height"
       fill="white"
       :x="dragRectX" :y="dragRectY">
  </rect>
</template>
<script>
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

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
  components: {},
  data() {
    return {
      icon: faArrowsAlt,
    };
  },
  mounted() {
    const drag = this.$refs['dragRect'];

    drag.addEventListener('click', (evt) => {
      evt.stopPropagation(); // prevents appearing on App.vue
      if (this.deleteMode) {
        this.$store.dispatch('USERLOG_DELETE_ITEM', {
          type: 'node',
          id: this.id
        })
        return;
      }
    });

    drag.addEventListener('mousedown', (mouseDownEvt) => {
      mouseDownEvt.stopPropagation(); // prevents appearing on App.vue

      let HAS_MOVED = false;
      const removeMouseWatcher = this.$watch('mouse', (val) => {
        this.$store.commit('MOVE_OBJECT_TO', {
          objectId: this.id,
          newX: val.x,
          newY: val.y
        });
        this.$emit('update:localX', val.x)
        this.$emit('update:localY', val.y)
        HAS_MOVED = true;
      })

      // removes this course component's global mouse movement
      // event listeners after mouseup event and commits the final
      // location to userLog so that timetravel includes node movements
      const mouseUpHandler = () => {
        if (HAS_MOVED) {
          this.$store.dispatch('USERLOG_SAVE_NODE_LOCATION', {
            id: this.id,
            x: this.currX,
            y: this.currY,
          });
        }

        // remove wathing of mouse pos from Vuex store + mouseup event
        removeMouseWatcher();
        window.removeEventListener('mouseup', mouseUpHandler);
      };

      window.addEventListener('mouseup', mouseUpHandler);
    });
  },
  computed: {
    mouse() {
      const { x, y } = this.$store.state.UI.mouse;
      return { x, y }; // reactivity needs this pattern
    },
    deleteMode() {
      return this.$store.state.UI.deleteMode;
    }
  },
};
</script>
<style scoped>

#drag-rect {
  cursor: move;
  pointer-events: bounding-box;
  opacity: 0;
}

</style>
