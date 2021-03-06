<template>
  <div id="page-outer-container"
       :class="{ 'delete-mode': deleteMode, 'visible': organized }"
       :style="scrollingStyles"
       ref="outer-page">

    <global-icons></global-icons>

    <template v-if="showOverlay">
      <overlay></overlay>
    </template>


    <div id="buttons">
      <button @click="resetZoom">
        Reset zoom
      </button>

      <br><br>

      <template v-if="debugMode">
      <button @click="resetState">
        Reset state
      </button>

      <br><br>

      <button @click="organize">
        Organize
      </button>
      </template>
    </div>

    <debug-form></debug-form>


    <div v-if="debugMode" id="traveler">
      Time travel {{ ttPosIndicator }}
      <br>
      <button @click="travel(-1)">←</button>
      <button @click="resetTravel">Reset</button>
      <button @click="travel(1)">→</button>
    </div>


    <svg ref="outer-svg"
         id="outer-svg"
         width="100%" height="100%"
         style="border:0px solid blue;"
         class="hidden"
         :class="{ 'visible': organized }"
         xmlns="http://www.w3.org/2000/svg">
      <g ref="outer-g">

      <template v-for="c in connections">
        <connection
          :id="c.connection_id"
          :from="c.from"
          :to="c.to"
          :to-mouse-mode="false"
          :user-added="!!c.userAdded"
          :key="c.from + c.to + c.timestamp"
          :comment="c.text"
          ></connection>
      </template>

      <template v-if="showConnectionAdder">
        <connection
          :from="newConnection.from"
          :to="newConnection.to"
          :to-mouse-mode="true"
          :user-added="true"
        ></connection>
      </template>

      <template v-for="c in nodes">
        <smiley
          :key="`smiley-${c.id}`"
          :parent-id="c.id"
          :parent-vertical-middle-point="10 + nodeMiddlePoint(c.id)"
              ></smiley>
        <star
          :key="`star-${c.id}`"
          :parent-id="c.id"
          :parent-vertical-middle-point="10 + nodeMiddlePoint(c.id)"
              ></star>
        <node :key="c.id"
              :id="c.id"
              :name="c.name"
              :type="c.type"
                ></node>
      </template>

    </g>

    </svg>

  </div>
</template>
<script>
import { event, select, zoom, zoomIdentity } from 'd3';

import Node from './components/Node.vue';
import Connection from './components/Connection.vue';
import Overlay from './components/Overlay.vue';
import GlobalIcons from './components/GlobalIcons.vue';
import DebugForm from './components/DebugForm.vue';
import SmileyClicker from './components/SmileyClicker.vue';
import StarClicker from './components/StarClicker.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    node: Node,
    connection: Connection,
    overlay: Overlay,
    globalIcons: GlobalIcons,
    debugForm: DebugForm,
    star: StarClicker,
    smiley: SmileyClicker,
  },
  data() {
    return {
      debugMode: false,
      svgWidth: 0,
      svgHeight: 0,
      showNewNodeAdder: false,
      newNode: {
        x: 0,
        y: 0,
      },
      appZoom: undefined,
      zoomListenerElement: undefined,
    }
  },
  created() {

    // this is a "hack":
    // first draw everything on screen to get the
    // sizes of nodes /getBoundingClientRect/ and
    // then actually organize them
    if (!this.$store.state.stateTouched) {
        this.$store.commit('ORGANIZE_OBJECTS');
      setTimeout(() => {
        this.$store.commit('ORGANIZE_OBJECTS');
      }, 0)
    }

    this.$store.commit('RESET_USERLOG_TRAVEL');

    // if deleteMode was ON when the page was loaded
    // turn it off so the user is not confused
    if (this.$store.state.UI.deleteMode) {
      this.toggleDeleteMode();
    }
  },
  mounted() {

    if (window.location.search.indexOf("debug=true") !== -1) {
      this.debugMode = true;
    }

    const svg = this.$refs['outer-svg'];
    const outerg = this.$refs['outer-g'];

    // these are used for viewBox --> might not be needed at all in the end
    const size = svg.getBoundingClientRect()
    this.svgWidth = size.width;
    this.svgHeight = size.height;

    // attach d3 zoom and pan listeners to outer-svg and transform the g elem
    // at zoom events


    this.$nextTick(() => { // this is needed in order to have everything drawn
      this.$store.commit('SET_APP_MARGINS', svg.getBoundingClientRect());
    })

    const onZoomEvent = () => {
      outergSelection.attr('transform', event.transform)
      this.$store.commit('ZOOM', event.transform)
    }

    const zoomBehaviour = zoom().on('zoom', onZoomEvent)

    const svgSelection = select(svg);
    const outergSelection = select(outerg);

    const factor = 0.5;
    zoomBehaviour.translateBy(svgSelection, -400, -300)
    zoomBehaviour.scaleTo(svgSelection, factor);

    // user can cancel adding a connection between nodes by clicking "on blank"
    outergSelection.on('click', () => {
      const overlay = this.$store.state.overlay;
      if (overlay.connectionFrom) {
        this.$store.commit('CLOSE_OVERLAY'); // this resets link adding
      }
    })

    svgSelection.on('mousemove', () => {
      this.$store.commit('SET_MOUSE_POSITION', { x: event.clientX, y: event.clientY });
    })

    zoomBehaviour(svgSelection);

    // this prevents zooming from dblclicking on elements or wheeling over them
    // ---> only dblclicks and wheeling on the *background* zooms
    zoomBehaviour.filter(() => {
      if (event.target.id === 'outer-svg') {
        return true;
      }
      return false;
    })

    this.appZoom = zoomBehaviour;
    this.zoomListenerElement = svgSelection;

  },
  computed: {
    organized() {
      return this.$store.state.stateTouched;
    },
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

    showConnectionAdder() {
      return !!this.$store.state.overlay.connectionFrom && !this.showOverlay;
    },
    newConnection() {
      return {
        from: this.$store.state.overlay.connectionFrom,
        to: '',
      };
    },
  },
  methods: {

    nodeMiddlePoint(nodeId) {
      return this.$store.getters.containerSize(nodeId).height / 2;
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

    travel(dir) {
      this.$store.commit('TRAVEL_USERLOG_HISTORY', dir);
    },

    resetTravel() {
      this.$store.commit('RESET_USERLOG_TRAVEL')
    },

  },
}
</script>
<style scoped>

  .visible {
    visibility: visible !important;
    opacity: 1 !important;
  }

  .hidden {
    opacity: 0;
    transition: .5s opacity;
  }

  #page-outer-container {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: -100px;
    padding: 25px;
    overflow: hidden;
  }

  @keyframes slideInFromLeft {
    0% {
      transform: translateX(-200%);
    }
    100% {
      transform: translateX(0);
    }
  }

  #buttons {
    position: absolute;
    bottom: 10px;
    left: 10px;
    animation: 1s ease-out 0s 1 slideInFromLeft;
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

  .delete-mode {
    cursor: url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJlcmFzZXIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1lcmFzZXIgZmEtdy0xNiIgcm9sZT0iaW1nIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik00OTcuOTQxIDI3My45NDFjMTguNzQ1LTE4Ljc0NSAxOC43NDUtNDkuMTM3IDAtNjcuODgybC0xNjAtMTYwYy0xOC43NDUtMTguNzQ1LTQ5LjEzNi0xOC43NDYtNjcuODgzIDBsLTI1NiAyNTZjLTE4Ljc0NSAxOC43NDUtMTguNzQ1IDQ5LjEzNyAwIDY3Ljg4Mmw5NiA5NkE0OC4wMDQgNDguMDA0IDAgMCAwIDE0NCA0ODBoMzU2YzYuNjI3IDAgMTItNS4zNzMgMTItMTJ2LTQwYzAtNi42MjctNS4zNzMtMTItMTItMTJIMzU1Ljg4M2wxNDIuMDU4LTE0Mi4wNTl6bS0zMDIuNjI3LTYyLjYyN2wxMzcuMzczIDEzNy4zNzNMMjY1LjM3MyA0MTZIMTUwLjYyOGwtODAtODAgMTI0LjY4Ni0xMjQuNjg2eiI+PC9wYXRoPjwvc3ZnPgo='), auto;
  }

</style>
