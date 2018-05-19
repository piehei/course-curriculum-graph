
<template>
  <svg :width="width"
       :height="height"
       :x="currX"
       :y="currY"
       >
    <handle
      :parent-delta-x="parentX"
      :parent-delta-y="parentY"
      :dragCircleX="handlePosX"
      :dragCircleY="8"
      :curr-x.sync="currX"
      :curr-y.sync="currY"
      :id="id"
      ></handle>
    <g>

    <!-- <text x="25"
          y="80"
          font-size="14">Topic</text> -->

      <rect ref="container"
            x="0"
            y="35"
            rx="10"
            ry="10"
            :width="bgRectWidth + 20"
            :height="bgRectHeight + 10"
            stroke="grey"
            stroke-width="1"
            fill="white">
      </rect>

      <g id="g-content"
         ref="gContent">
        <text id="course-name"
              x="10"
              y="55"
              width="100"
              height="20"
              fill="red"
              font-size="20px"> {{ name }} </text>
      </g>
    </g>
  </svg>
</template>
<script>
import Handle from './Handle.vue';

export default {
  name: 'Topic',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
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
    parentX: {
      type: Number,
      required: true,
    },
    parentY: {
      type: Number,
      required: true,
    },
  },
  components: {
    handle: Handle,
  },
  data() {
    return {
      width: "250",
      height: "80",
      currX: this.x,
      currY: this.y,
      bgRectHeight: 0,
      bgRectWidth: 0,
    };
  },
  mounted() {
    // because of the limitations of SVG sizing
    // the background rect has to be manually sized
    // based on the contents of the content g
    const g = this.$refs.gContent;
    const gBounding = g.getBoundingClientRect();
    this.bgRectHeight = gBounding.height;
    this.bgRectWidth = gBounding.width;

    const c = this.$refs.container;
    const cBounding = c.getBBox();
    this.containerWidth = cBounding.width;
    this.containerHeight = cBounding.height;
    this.$store.commit('SAVE_OBJECT_CONTAINER_SIZE',
      { id: this.id, width: this.containerWidth, height: this.containerHeight, top: cBounding.y });
  },
  computed: {
    handlePosX() {
      return this.bgRectWidth;
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
