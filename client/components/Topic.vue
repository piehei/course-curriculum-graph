
<template>
  <svg :width="width"
       :height="height"
       :x="currX"
       :y="currY"
        >
    <handle
      :parent-delta-x="parentX"
      :parent-delta-y="parentY"
      :dragCircleX="100"
      :dragCircleY="20"
      :curr-x.sync="currX"
      :curr-y.sync="currY"
      :id="id"
      ></handle>
    <g>
      <rect x="0" y="35" width="100%" height="100%" fill="green"></rect>
      <text id="course-name"
            x="50"
            y="50%"
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
  created() {},
  computed: {},
  methods: {},
}
</script>
<style scoped>
  #course-name {
    user-select: none;
  }
</style>
