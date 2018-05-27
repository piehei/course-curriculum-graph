<template>
  <svg width="100%"
       height="100%"
       x="0"
       y="0">
    <svg :x="currX" :y="currY">
      <handle
         :drag-circle-x="dragCircleX"
         :drag-circle-y="dragCircleY"
         :curr-x.sync="currX"
         :curr-y.sync="currY"
         :parent-delta-x="pageMargins"
         :parent-delta-y="pageMargins"
         :id="id"
         ></handle>

        <text id="course-name"
              x="25"
              y="25"
              font-size="14">Course</text>

      <!-- this is the background of the course -->
      <rect id="background-rect"
            ref="container"
            x="0"
            y="30"
            rx="10"
            ry="10"
            width="250"
            :height="bgRectHeight + 40"
            stroke="black"
            stroke-width="2"
            fill="white"></rect>


      <!-- this is a group that has all the contents inside the course element -->
      <g id="g-content"
         ref="gContent">

        <text id="course-name"
              x="25"
              y="65"
              font-size="20"> {{ name }} </text>
      </g>
    </svg>

  </svg>
</template>
<script>
import Handle from './Handle.vue';

export default {
  name: 'Box',
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
    },
  },
  components: {
    handle: Handle,
  },
  data() {
    return {
      width: 250,
      height: 250,
      containerWidth: 0,
      containerHeight: 0,
      mouseIsDown: false,
      currX: 0,
      currY: 0,
      bgRectHeight: 250,
    }
  },
  created() {
    this.currX = this.startX;
    this.currY = this.startY;
  },
  mounted() {

    // because of the limitations of SVG sizing
    // the background rect has to be manually sized
    // based on the contents of the content g
    const g = this.$refs.gContent;
    const gBounding = g.getBoundingClientRect();
    this.bgRectHeight = gBounding.height;

    this.$nextTick(() => {
      const c = this.$refs.container;
      const cBounding = c.getBBox();
      this.containerWidth = cBounding.width;
      this.containerHeight = cBounding.height;
      this.$store.commit('SAVE_OBJECT_CONTAINER_SIZE',
        { id: this.id, width: this.containerWidth, height: this.containerHeight, top: cBounding.y });
    })
  },
  computed: {
    dragCircleX () {
      return this.width - 20;
    },
    dragCircleY () {
      return 5;
    }
  },
  methods: {},
}
</script>
<style scoped>

#course-name {
  user-select: none;
}
</style>
