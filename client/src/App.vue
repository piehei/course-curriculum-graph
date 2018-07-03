<template>
  <div id="page-outer-container"
       :style="scrollingStyles"
       ref="outer-page">

    <div style="position:absolute;bottom:10px;right:10px;">
      <a href="https://github.com/piehei/course-curriculum-graph" target="_BLANK">Source code</a>
    </div>



    <template v-if="showOverlay">
      <overlay></overlay>
    </template>

    <div id="top-buttons">

      <tooltip direction="right">
        <font-awesome-icon
          :icon="linkIcon"
          size="2x"
          @click="add('link')">
        </font-awesome-icon>
        <template slot="text">
          Add new connection
        </template>
      </tooltip>

      <br><br>

      <tooltip direction="right">
        <font-awesome-icon
          :icon="commentIcon"
          size="2x"
          @click="add('comment')">
        </font-awesome-icon>
        <template slot="text">
          Add new comment
        </template>
      </tooltip>
    </div>

    <div id="buttons">
      <button @click="resetZoom">
        Reset zoom
      </button>

      <br><br>

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
      Delete:<br>
      <button @click="toggleDeleteMode"
              style="font-size:12px;background:#ff000057;">{{ deleteMode ? 'Disable' : 'Enable' }} delete mode</button>
      <template v-if="deleteMode">
        <br>
        Click on any node or connection to delete it
      </template>
    </div>

    <div id="traveler">
      Time travel {{ ttPosIndicator }}
      <br>
      <button @click="travel(-1)">←</button>
      <button @click="resetTravel">Reset</button>
      <button @click="travel(1)">→</button>
      <br>
      <a href="#" @click.prevent="showTimeTravelInfo = !showTimeTravelInfo">READ THIS</a>
      <template v-if="showTimeTravelInfo">
        <br>
          As of now this is implemented as a list of events and the arrows<br>
          travel that list. Whenever a new user action occurs (adding of connection/node or deleting),<br>
          the list is travelled to its end -> to the current state / present moment.<br>
          This comes with a user-confusing problem:<br>
          Make changes, then go back in time a few clicks, now make a new change.<br>
          --> the change is made when the time had been travelled backwards and the UI showed that state,<br>
          now the new change brings the state back to the current time and it "jumps over" a couple of events.<br>
          <b>How to solve?</b> Maybe a button that commits a previous state in time to be the new state<br>(or in other words: lets the user remove some actions by going backwards and then clicking smth like 'I want this to be current')
      </template>
    </div>


    <svg ref="outer-svg"
         width="100%" height="100%"
         style="border:0px solid blue;"
         xmlns="http://www.w3.org/2000/svg">
      <g ref="outer-g">

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

    </g>

    </svg>

  </div>
</template>
<script>
import { event, select, zoom, zoomIdentity } from 'd3';
import { faLink } from '@fortawesome/fontawesome-free-solid';
import { faComment } from '@fortawesome/fontawesome-free-regular';

import Node from './components/Node.vue';
import Connection from './components/Connection.vue';
import Overlay from './components/Overlay.vue';
//import Tooltip from './components/Tooltip.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    node: Node,
    connection: Connection,
    overlay: Overlay,
    //tooltip: Tooltip,
  },
  data() {
    return {
      linkIcon: faLink,
      commentIcon: faComment,
      svgWidth: 0,
      svgHeight: 0,
      pageMargins: 35,
      showNewNodeAdder: false,
      newNode: {
        x: 0,
        y: 0,
      },
      showTimeTravelInfo: false,
      appZoom: undefined,
      zoomListenerElement: undefined,
    }
  },
  created() {
    if (!this.$store.state.stateTouched) {
      this.$store.commit('ORGANIZE_OBJECTS');
    }
    this.$store.commit('RESET_USERLOG_TRAVEL');

    // if deleteMode was ON when the page was loaded
    // turn it off so the user is not confused
    if (this.$store.state.UI.deleteMode) {
      this.toggleDeleteMode();
    }
  },
  mounted() {
    const svg = this.$refs['outer-svg'];
    const outerg = this.$refs['outer-g'];

    // these are used for viewBox --> might not be needed at all in the end
    const size = svg.getBoundingClientRect()
    this.svgWidth = size.width;
    this.svgHeight = size.height;

    // attach d3 zoom and pan listeners to outer-svg and transform the g elem
    // at zoom events

    const onZoomEvent = () => {
      outergSelection.attr('transform', event.transform)
      this.$store.commit('ZOOM', event.transform)
    }

    const zoomBehaviour = zoom().on('zoom', onZoomEvent)

    const svgSelection = select(svg);
    const outergSelection = select(outerg);

    zoomBehaviour(svgSelection);

    this.appZoom = zoomBehaviour;
    this.zoomListenerElement = svgSelection;

    // if the user clicks the page with CTRL down,
    // an empty node with editable text field will be added
    // --> pressing enter will add the node
    this.$refs['outer-page'].addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (!evt.ctrlKey) return;
      this.showNewNodeAdder = true;
      this.newNode.x = evt.clientX - this.pageMargins - 65;
      this.newNode.y = evt.clientY - this.pageMargins - 70;
    })
  },
  computed: {

    viewBox() {
      // TODO: not needed as of now...
      const x = 0;
      const y = 0;
      const width = this.svgWidth;
      const height = this.svgHeight;
      return `${x} ${y} ${width} ${height}`;
    },
    ttPosIndicator() {
      return `${this.$store.state.userLogIndex}/${this.$store.state.userLog.length}`;
    },
    deleteMode() {
      return this.$store.state.UI.deleteMode;
    },
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
      return this.$store.getters.nodes;
    },
    connections() {
      return this.$store.getters.connections;
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
    showOverlay() {
      return !!this.$store.state.overlay.type;
    },
  },
  methods: {

    toggleDeleteMode() {
      this.$store.commit('TOGGLE_DELETE_MODE');
    },

    newNodeAdded() {
      this.showNewNodeAdder = false;
      this.newNode.x = 0;
      this.newNode.y = 0;
    },

    resetZoom() {
      // reset the zoom listening element to un-zoomed, un-panned state
      // automatically sets the zoom state of the outer-g element to correct
      // NOTE: we're NOT calling this on the outer-g, we're calling this on the element
      //       that's listening for zoom events
      this.zoomListenerElement.transition().duration(500).call(this.appZoom.transform, zoomIdentity);
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
    },

    add(type) {
      if (type === 'comment') {
        this.$store.commit('ADD_COMMENTS', undefined);
      }

      if (type === 'link') {
        this.$store.commit('ADD_LINKS', undefined);
      }

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
    overflow: hidden;
  }

  #top-buttons {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  #top-buttons svg {
    cursor: pointer;
  }

  #buttons {
    position: absolute;
    bottom: 10px;
    left: 10px;
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
    right: 120px;
    font-size: 12px;
  }

</style>
