
<template>
  <svg id="drag-circle"
       ref="dragCircle"
       width="20"
       height="25"
       :x="dragCircleX" :y="dragCircleY">
    <!--
  <circle id="drag-circle"
          ref="dragCircle"
          :cx="dragCircleX"
          :cy="dragCircleY"
          r="10" fill="red"></circle> -->
          <font-awesome-icon :icon="icon" size="lg" :transform="{ rotate: 45 }"></font-awesome-icon>
  </svg>
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
    dragCircleX: {
      type: Number,
      required: true,
    },
    dragCircleY: {
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
  },
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      currX: 0,
      currY: 0,
      icon: faArrowsAlt,
    }
  },
  created() {},
  mounted() {
    console.log('mounting...');
    const drag = this.$refs['dragCircle'];
    drag.addEventListener('mousedown', () => {
      console.log('mouseIsDown')

      // this is called at every mouse movement event
      // this updates the location of the course element
      // to the current mouse location
      const mouseMoveHandler = (evt) => {
        //console.log('window: mousemove');
        // this takes care of placing the element at the cursor location
        this.currX = evt.clientX - this.dragCircleX - this.parentDeltaX;
        this.currY = evt.clientY - this.dragCircleY - this.parentDeltaY;
        this.$emit('update:currX', this.currX);
        this.$emit('update:currY', this.currY);
        this.$store.commit('SAVE_OBJECT_POSITION', {
          objectId: this.id,
          posX: this.currX,
          posY: this.currY }
        );
      }

      window.addEventListener('mousemove', mouseMoveHandler);

      // removes this course component's global mouse movement
      // event listeners after mouseup event
      const mouseUpHandler = () => {
        console.log('window: mouseup');
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        this.$store.commit('SAVE_OBJECT_POSITION', {
          objectId: this.id,
          posX: this.currX,
          posY: this.currY }
        );
      };

      window.addEventListener('mouseup', mouseUpHandler);
    });
  },
  computed: {},
  methods: {},
}
</script>
<style scoped>
#drag-circle {
  cursor: move;
  pointer-events: bounding-box;
}

</style>
