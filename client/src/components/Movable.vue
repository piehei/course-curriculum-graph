<template>
  <svg :width="width"
       :height="height"
       :x="currX"
       :y="currY"
       xmlns="http://www.w3.org/2000/svg">

    <circle id="drag-circle"
            ref="dragCircle"
            :cx="dragCircleX"
            :cy="dragCircleY"
            r="10" fill="red"></circle>
    <!-- this is the background of the course -->
    <rect id="background-rect"
          x="0"
          y="30"
          rx="10"
          ry="10"
          width="250"
          :height="bgRectHeight + 40"
          fill="white"></rect>

    <!-- this is a group that has all the contents inside the course element -->
    <g id="g-content"
       ref="gContent">
      <slot></slot>
    </g>

  </svg>
</template>
<script>
import { getCoursePosition,
         setCoursePosition } from '../utils.js';

export default {
  name: 'Course',
  props: {
    pageMargins: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    startX: {
      type: Number,
      required: true,
    },
    startY: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }

  },
  components: {
  },
  data() {
    return {
      width: 100,
      height: 100,
      mouseIsDown: false,
      currX: 0,
      currY: 0,
      bgRectHeight: 250,
      topics: [
        { name: "Topic 1 is about ..." },
      ]
    }
  },
  created() {
    const savedPos = getCoursePosition(this.id);
    if (savedPos) {
      this.currX = savedPos.x;
      this.currY = savedPos.y;
    } else {
      this.currX = this.startX;
      this.currY = this.startY;
    }
  },
  mounted() {

    // because of the limitations of SVG sizing
    // the background rect has to be manually sized
    // based on the contents of the content g
    const g = this.$refs.gContent;
    const gBounding = g.getBoundingClientRect();
    this.bgRectHeight = gBounding.height;

    const drag = this.$refs['dragCircle'];
    drag.addEventListener('mousedown', () => {
      console.log('mouseIsDown')

      // this is called at every mouse movement event
      // this updates the location of the course element
      // to the current mouse location
      const mouseMoveHandler = (evt) => {
        //console.log('window: mousemove');
        // this takes care of placing the element at the cursor location
        this.currX = evt.clientX - this.dragCircleX - this.pageMargins;
        this.currY = evt.clientY - this.dragCircleY - this.pageMargins;
      }

      window.addEventListener('mousemove', mouseMoveHandler);

      // removes this course component's global mouse movement
      // event listeners after mouseup event
      const mouseUpHandler = () => {
        console.log('window: mouseup');
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        setCoursePosition(this.id, this.currX, this.currY);
      };

      window.addEventListener('mouseup', mouseUpHandler);

    });
  },
  computed: {
    dragCircleX () {
      return this.width / 2;
    },
    dragCircleY () {
      return 15;
    }
  },
  methods: {},
}
</script>
<style scoped>

#drag-circle {
  cursor: move;
}

#course-name {
  user-select: none;
}
</style>
