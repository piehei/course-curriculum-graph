<template>
  <div id="page-outer-container"
       :style="scrollingStyles">

    <div style="position:absolute;top:10px;right:10px;">
      <a href="https://github.com/piehei/course-curriculum-graph" target="_BLANK">Source code</a>
    </div>

    <button id="reset-state"
            @click="resetState">
      Reset state
    </button>


    <svg width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg">


      <template v-for="c in connections">
        <connection
          :from="c.from"
          :to="c.to"
          :key="c.from + c.to"
          v-if="visible(c)"
          ></connection>
      </template>


      <template v-for="c in courses">
        <node
              :key="c.id"
              :id="c.id"
              :name="c.name"
              :pageMargins="pageMargins"
              :x="c.x"
              :y="c.y"
              :type="c.type"
                ></node>
      </template>

    </svg>

  </div>
</template>
<script>
import Node from './components/Node.vue';
import Connection from './components/Connection.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    node: Node,
    connection: Connection,
  },
  data() {
    return {
      pageMargins: 35,
      courses: this.$store.state.nodeList,
    }
  },
  created() {
    if (!this.$store.state.stateTouched) {
      this.$store.commit('ORGANIZE_OBJECTS');
    }
  },
  computed: {
    connections() {
      const base = this.$store.getters.baseConnections;
      const between = this.$store.state.connections;
      return base.concat(between);
    },
    scrollingStyles() {

      // dirty hack; this has to be rethought

      const lp = this.$store.state.lowestPoint;
      if (lp < window.innerHeight - 200) {
        return "bottom:10px";
      }

      const delta = this.$store.state.lowestPoint - window.innerHeight;
      const negativeBottom = -(delta + 200);
      return `bottom:${negativeBottom}px`;
    },
  },
  methods: {

    resetState() {
      this.$store.commit('RESET_STATE');
    },

    visible(connection) {
      return true; // this.$store.getters.connectionEndMoving(connection);
    },

},
}
</script>
<style scoped>

  #page-outer-container {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: -100px;
    padding: 25px;
  }

  #reset-state {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  svg {
    user-select: none;
  }
</style>
