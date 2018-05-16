
<template>
  <svg :width="width"
       :height="height"
       :x="currX"
       :y="currY"

        >
    <handle
      :parent-delta-x="parentX"
      :parent-delta-y="parentY"
      :dragCircleX="227"
      :dragCircleY="8"
      :curr-x.sync="currX"
      :curr-y.sync="currY"
      :id="id"
      ></handle>
    <g>

    <text x="25"
          y="25"
          font-size="14">Topic</text>

      <rect ref="container"
            x="0"
            y="35"
            rx="10"
            ry="10"
            width="250"
            height="40"
            stroke="grey"
            stroke-width="1"
            fill="white">
      </rect>

      <text id="course-name"
            x="50"
            y="55"
            width="100"
            height="20"
            fill="red"
            font-size="20px"> {{ name }} </text>
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
      height: "200",
      currX: this.x,
      currY: this.y,
    };
  },
  mounted() {
    const c = this.$refs.container;
    const cBounding = c.getBBox();
    this.containerWidth = cBounding.width;
    this.containerHeight = cBounding.height;
    this.$store.commit('SAVE_OBJECT_CONTAINER_SIZE',
      { id: this.id, width: this.containerWidth, height: this.containerHeight, top: cBounding.y });
  },
  computed: {

    middlePoint() {
      return {
        x: this.parentX + this.x,
        y: this.parentY + this.y,
      };
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
