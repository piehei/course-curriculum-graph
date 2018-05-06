<template>
  <svg :width="width"
       :height="height"
       :x="currX"
       :y="currY"
       xmlns="http://www.w3.org/2000/svg">

    <circle id="dragCircle"
            ref="dragCircle"
            :cx="dragCircleX" :cy="dragCircleY" r="10" fill="red"></circle>

    <rect x="0" y="30" rx="10" ry="10" width="250" height="150" fill="white"></rect>

    <text x="25" y="65" font-size="20"> {{ name }} </text>

  </svg>
</template>
<script>
export default {
  name: 'Course',
  props: {
    pageMargins: {
      type: Number,
      requireD: true,
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
  components: {},
  data() {
    return {
      width: 250,
      height: 250,
      mouseIsDown: false,
      currX: 0,
      currY: 0,
    }
  },
  created() {
    this.currX = this.startX;
    this.currY = this.startY;
  },
  mounted() {
    console.log(this.$refs)
    console.log(this.$refs['dragCircle'])
    const drag = this.$refs['dragCircle'];
    drag.addEventListener('mousedown', (evt) => {
      console.log('mouseIsDown')
      this.mouseIsDown = true;

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
      const mouseUpHandler = (evt) => {
        console.log('window: mouseup');
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
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

#dragCircle {
  cursor: move;
}
</style>
