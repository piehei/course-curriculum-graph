<template>
  <svg width="100%"
       height="100%"
       x="0"
       y="0">
    <svg :x="x" :y="y">

        <text id="course-name"
              x="25"
              y="25"
              font-size="14">{{ type === 'PARENT' ? 'Course' : 'Topic' }}</text>

      <!-- this is the background of the course -->
      <rect id="background-rect"
            ref="container"
            x="0"
            y="30"
            rx="10"
            ry="10"
            width="250"
            :height="bgRectHeight + 40"
            :stroke=" type === 'PARENT' ? 'blue' : 'orange'"
            stroke-width="2"
            fill="white"></rect>
      <handle
         :drag-rect-x="4"
         :drag-rect-y="34"
         :width="250 - 8"
         :height="bgRectHeight + 40 - 8"
         :curr-x="x"
         :curr-y="y"
         :parent-delta-x="pageMargins"
         :parent-delta-y="pageMargins"
         :id="id"
         ></handle>


      <!-- this is a group that has all the contents inside the course element -->
      <g id="g-content"
         ref="gContent">

        <text id="course-name"
              style="pointer-events:none;"
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
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
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
      bgRectHeight: 250,
    }
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
    },
  },
  methods: {},
}
</script>
<style scoped>

#course-name {
  user-select: none;
}
</style>
