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

        <text id="course-name"
              x="25"
              y="65"
              font-size="20"> {{ name }} </text>

      </g>
    </svg>

    <template v-for="topic in topicsList">
      <topic :name="topic.name"
             :parent-x="pageMargins"
             :parent-y="pageMargins"
             :id="topic.id"
             :x="topic.x"
             :y="topic.y"></topic>
    </template>

  </svg>
</template>
<script>
import Topic from './Topic.vue';
import Handle from './Handle.vue';

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
    },
    topicsList: {
      type: Array,
      required: true,
    },

  },
  components: {
    topic: Topic,
    handle: Handle,
  },
  data() {
    return {
      width: 250,
      height: 250,
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

#course-name {
  user-select: none;
}
</style>
