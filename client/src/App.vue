<template>
  <div id="page-outer-container"
       :style="scrollingStyles"
       ref="outer-page">

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

    </div>

    <div id="add-instructions">
      New connection:<br>
      - CTRL-click on a node, then CTRL-click on another node
      <br>
      New node:<br>
      - CTRL-click on empty space, enter name, press enter
      <br>
      Delete: not supported yet
    </div>

    <div id="traveler">
      Time travel for connections/nodes (pos changes not supported yet)
      <br>
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


      <template v-for="c in nodes">
        <node :key="c.id"
              :id="c.id"
              :name="c.name"
              :pageMargins="pageMargins"
              :type="c.type"
                ></node>
      </template>


      <template v-if="showNewNodeAdder">
        <node
          :key="-1"
          :id="'-1'"
          :name="''"
          :pageMargins="pageMargins"
          :x="newNode.x"
          :y="newNode.y"
          :type="'NEW_NODE'"
          @new-node-added="newNodeAdded"
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
      showNewNodeAdder: false,
      newNode: {
        x: 0,
        y: 0,
      }
    }
  },
  created() {
    if (!this.$store.state.stateTouched) {
      this.$store.commit('ORGANIZE_OBJECTS');
    }
    this.$store.commit('RESET_USERLOG_TRAVEL');
  },
  mounted() {
    const container = this.$refs['outer-page'];

    // if the user clicks the page with CTRL down,
    // an empty node with editable text field will be added
    // --> pressing enter will add the node
    container.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (!evt.ctrlKey) return;
      console.log(evt)
      this.showNewNodeAdder = true;
      this.newNode.x = evt.clientX - this.pageMargins - 65;
      this.newNode.y = evt.clientY - this.pageMargins - 70;
    })
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
    nodes() {
      const base = this.$store.state.nodeList;
      const userAdded = this.$store.getters.userAddedNodes;
      return base.concat(userAdded);
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
    newNodeAdded() {
      this.showNewNodeAdder = false;
      this.newNode.x = 0;
      this.newNode.y = 0;
    },
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
    margin-top: -20px;
    font-size:12px;
  }

  #traveler button {
    margin: 2px 10px;
  }

  svg {
    user-select: none;
  }

  #add-instructions {
    position: absolute;
    top: 10px;
    left: 120px;
    font-size: 12px;
  }

</style>
