<template>
  <div id="page-outer-container"
       :style="scrollingStyles">

    <div style="position:absolute;top:10px;right:10px;">
      <a href="https://github.com/piehei/course-curriculum-graph" target="_BLANK">Source code</a>
    </div>

    <div id="buttons">
      <button @click="resetState">
        Reset state
      </button>

      <br><br>

      <button @click="organize">
        Organize
      </button>

      <br><br>

      Line shape:
      <br>

      <select v-model="pathShape">
        <option disabled value="">Please select one</option>
        <option v-for="shape in possiblePathShapes"
                :key="shape">
          {{ shape }}
        </option>
      </select>

      <br><br>
      Add new:<br>
      - connection: CTRL-click
    </div>


    <div id="traveler">
      <button @click="travel(-1)"><--</button>
      <button @click="resetTravel">Reset</button>
      <button @click="travel(1)">--> </button>
    </div>


    <svg width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg">


      <template v-for="c in connections">
        <connection
          :from="c.from"
          :to="c.to"
          :user-added="!!c.timestamp"
          :key="c.from + c.to"
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
    this.$store.commit('RESET_USERLOG_TRAVEL');
  },
  computed: {
    pathShape: {
      get() {
        return this.$store.state.UI.pathShape;
      },
      set(val) {
        this.$store.commit('CHANGE_PATH_SHAPE', val);
      },
    },
    possiblePathShapes() {
      return this.$store.state.UI.possiblePathShapes;
    },
    connections() {
      const base = this.$store.getters.baseConnections;
      const userAdded = this.$store.getters.userAddedConnections;
      return base.concat(userAdded);
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

    organize() {
      this.$store.commit('ORGANIZE');
    },

    toggleCurve() {
      this.$store.commit('TOGGLE_CURVES');
    },

    travel(dir) {
      this.$store.commit('TRAVEL_USERLOG_HISTORY', dir);
    },

    resetTravel() {
      this.$store.commit('RESET_USERLOG_TRAVEL')
    }

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

  #buttons {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  #traveler {
    text-align: center;
    margin-top: -10px;
  }

  #traveler button {
    margin: 0 10px;
  }

  svg {
    user-select: none;
  }


</style>
