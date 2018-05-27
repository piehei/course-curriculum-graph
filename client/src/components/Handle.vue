
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
    parentDeltaX: {
      type: Number,
      required: true,
    },
    parentDeltaY: {
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
  },
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      currX: 0,
      currY: 0,
      icon: faArrowsAlt,
      lastMousePos: {
        x: 0,
        y: 0,
      },
    }
  },
  created() {},
  mounted() {
    console.log('mounting...');
    const drag = this.$refs['dragRect'];
    drag.addEventListener('mousedown', (mouseDownEvt) => {
      console.log('mouseIsDown')

      this.lastMousePos.x = mouseDownEvt.clientX;
      this.lastMousePos.y = mouseDownEvt.clientY;

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

        this.$store.commit('MOVE_OBJECT_BY', {
          objectId: this.id,
          deltaX: deltaX,
          deltaY: deltaY }
        );
      }

      window.addEventListener('mousemove', mouseMoveHandler);

      // removes this course component's global mouse movement
      // event listeners after mouseup event
      const mouseUpHandler = () => {
        console.log('window: mouseup');
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
      };

      window.addEventListener('mouseup', mouseUpHandler);
    });
  },
  computed: {},
  methods: {},
}
</script>
<style scoped>
#drag-rect {
  cursor: move;
  pointer-events: bounding-box;
}

</style>
