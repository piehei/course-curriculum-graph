<template>
  <svg class="node-container-svg"
       :x="x"
       :y="y">

    <!-- 0 px from top -->
    <text id="course-name"
          :x="leftMargin + 25"
          y="0"
          font-size="12"> </text>

    <!-- 10 px from top -->
    <!-- this is the background of the course -->
    <rect id="background-rect"
          ref="container"
          :x="leftMargin"
          y="10"
          rx="10"
          ry="10"
          width="250"
          :height="contentHeightPlusMargin"
          :stroke=" type === 'PARENT' ? 'blue' : 'orange'"
          stroke-width="2"
          fill="white"
          @mouseover="mouseHovers"
          @mouseleave="delayMouseHovering"
          ></rect>

    <!-- this is the plus/minus sign on the right side -->
    <!-- y = background-rect top + half of height - half of own height -->
    <svg :x="leftMargin + 255"
         :y="10 + (contentHeightPlusMargin) / 2 - 20"
         width="20px"
         height="20px"
         style="overflow:visible;">

      <foreignObject width="200" height="50" x="0" y="0" style="overflow:visible;pointer-events:none;">
        <tooltip direction="right" size="small">
          <font-awesome-icon
            :icon="commentIcon"
            @click="addComment"
            style="cursor:pointer;">
          </font-awesome-icon>

            <template slot="text">
              Add comments
            </template>
        </tooltip>
        <br>
        <tooltip direction="right" size="small">
          <font-awesome-icon
            :icon="linkIcon"
            @click="addLink"
            style="cursor:pointer;">
          </font-awesome-icon>

            <template slot="text">
              {{ connectionIsBeingAdded ? 'Connect here' : 'Add link' }}
            </template>
        </tooltip>
      </foreignObject>

    </svg>

    <template v-if="showComments">
      <transition mode="in-out">
      <comments
        @mouseHoverStarts="commentsMouseHoverChange(true)"
        @mouseHoverEnds="commentsMouseHoverChange(false)"
        :parent-id="id"
        :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2"
        :leftSidePos="leftMargin + 285">
      </comments>
      </transition>
    </template>

    <template v-if="showNewNodeAdder">

      <foreignObject x="25" y="50" width="100" height="20">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <input
               ref="input-field"
               placeholder="Press enter to save"
               v-model="newNodeName"
               @keyup.enter="inputEditingEnter">
            <div v-if="showWarning">
              Cannot save empty name
            </div>
          </div>
      </foreignObject>

    </template>

    <!-- this is a group that has all the contents inside the course element -->
    <g id="g-content">
      <foreignObject :x="leftMargin + 25" y="15" width="200px" height="10px" style="overflow:visible;pointer-events:none;">
        <div ref="gContent" class="content"> {{ name }}</div>
      </foreignObject>
    </g>
  </svg>
</template>
<script>
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { select, drag, event } from 'd3';

import Comments from './Comments.vue';
import SmileyClicker from './SmileyClicker.vue';
import StarClicker from './StarClicker.vue';

export default {
  name: 'Box',
  props: {
    id: {
      type: String,
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
    comments: Comments,
    smiley: SmileyClicker,
    star: StarClicker,
  },
  data() {
    return {
      linkIcon: faLink,
      commentIcon: faComment,
      width: 250,
      height: 250,
      leftMargin: 5,
      containerWidth: 0,
      containerHeight: 0,
      mouseIsDown: false,
      contentHeight: 250,
      contentHeightPlusMargin: 250,
      newNodeName: '',
      showWarning: false,
      hideComments: false,
      showNewNodeAdder: false,
      isBeingDragged: false,
      mouseIsHovering: false,
      mouseIsHoveringComments: false,
    };
  },
  mounted() {

    // because of the limitations of SVG sizing
    // the background rect has to be manually sized
    // based on the contents of the content g
    const g = this.$refs.gContent;
    const gBounding = g.getBoundingClientRect();
    this.contentHeight = gBounding.height;
    this.contentHeightPlusMargin = gBounding.height + 10;

    this.$nextTick(() => {
      const c = this.$refs.container;
      const cBounding = c.getBBox();
      this.containerWidth = cBounding.width;
      this.containerHeight = cBounding.height;
      this.$store.commit('SAVE_OBJECT_CONTAINER_SIZE',
        { id: this.id, width: this.containerWidth, height: this.containerHeight, top: cBounding.y });
    })


    // focus cursor in input text field
    if (this.type === 'NEW_NODE') {
      this.$refs['input-field'].focus()
    }

    //////////////////// DRAG AND DROP LOGIC
    const dragHandle = this.$refs['container'];
    const that = this;
    var dragSelection = select(dragHandle);
    const started = () => {
      this.isBeingDragged = true;
      this.mouseIsHovering = false;
      this.mouseIsHoveringComments = false;
      dragSelection.classed("dragging", true);

      // const OLD_POSITION = {
      //   x: this.x,
      //   y: this.y,
      // };

      event.on("drag", dragged).on("end", ended);

      // console.log('START DRAGGING')
      // console.log(`orig: ${this.x} ${this.y}`);
      // const mx = event.sourceEvent.clientX - this.$store.state.UI.marginX;
      // const my = event.sourceEvent.clientY - this.$store.state.UI.marginY;
      // console.log(`mouse: ${mx} ${my}`);
      // const xy = SCALE_X_Y(this.$store.state, {x: this.x - mx, y: this.y - my });
      // const delta = { x: xy.x, y: xy.y };
      // const delta = {
      //   x: this.x - mx,
      //   y: this.y -my,
      // };

      let lastCommitTime = new Date();

      function dragged() {

        // throttle movement commits a bit
        const now = new Date();
        if (now - lastCommitTime < 20) {
          return;
        }

        lastCommitTime = now;

        const x = event.sourceEvent.clientX;
        const y = event.sourceEvent.clientY;

        //console.log(`mouse: ${x} ${y}`);
        //console.log(that.x, that.y)
        //console.log(that.containerWidth, that.containerHeight);

        // const all = selectAll(".CHILD");
        // all.each(function() {
        //   console.log(this);
        // })


        that.$store.commit('MOVE_OBJECT_TO', {
          objectId: that.id,
          //newX: x + delta.x,
          //newY: y + delta.y,
          newX: x,// + delta.x,
          newY: y,// + delta.y,
        });
      }

      function ended() {
        dragSelection.classed("dragging", false);
        that.$store.dispatch('USERLOG_SAVE_NODE_LOCATION', {
          id: that.id,
          x: that.x, // current computed property
          y: that.y, // DONT TOUCH
        });
        that.isBeingDragged = false;
      }
    };

    dragSelection.call(drag().on('start', started));
  },
  computed: {

    x() {
      return this.$store.getters.posById(this.id).x;
    },
    y() {
      return this.$store.getters.posById(this.id).y;
    },
    nodeTitle() {
      if (this.type === 'PARENT') {
        return 'Course';
      } else if (this.type === 'CHILD') {
        return 'Topic';
      } else if (this.type === 'NEW_NODE') {
        return 'New topic name:';
      }
    },
    dragCircleX () {
      return this.width - 20;
    },
    dragCircleY () {
      return 5;
    },
    showComments() {
      const comments = this.$store.getters.commentsByNodeId(this.id);
      return this.mouseIsHovering && comments.length > 0;
    },
    connectionIsBeingAdded() {
      // if this holds true, show a "Connect here" tooltip instead of
      // "Add link" with the linkIcon
      return !!this.$store.state.overlay.connectionFrom &&
        this.$store.state.overlay.connectionFrom !== this.id;
    },
  },
  methods: {

    commentsMouseHoverChange(val) {
      if (val) {
        this.mouseIsHovering = true;
        this.mouseIsHoveringComments = true;
      } else {
        this.mouseIsHovering = false;
        this.mouseIsHoveringComments = false;
      }
    },
    mouseHovers() {
      if (!this.isBeingDragged) {
        this.mouseIsHovering = true;
      }
    },
    delayMouseHovering() {
      const check = () => {
        if (!this.mouseIsHoveringComments) {
          this.mouseIsHovering = false;
        }
      }
      // in one second hide comments if not hovered over
      setTimeout(check, 1000);
    },

    addComment() {
      this.$store.commit('ADD_COMMENTS', this.id);
    },
    addLink(evt) {
      // propagation HAS to stop to prevent click handlers firing in App.vue
      evt.stopPropagation();
      this.$store.commit('CONNECTION_ADDING_CLICK', this.id);
    },
    inputEditingEnter() {
      if (this.newNodeName.length < 1) {
        this.showWarning = true;
        return;
      }

      this.$store.commit('USERLOG_ADD_NEW_NODE', {
        parentId: this.id,
        name: this.newNodeName,
        x: this.x + 300,
        y: this.y,
      });

      this.newNodeName = "";
      this.showNewNodeAdder = false;
    },
  },
}
</script>
<style scoped>
.node-container-svg {
  overflow: visible;
}

#course-name {
  user-select: none;
}


.v-leave { opacity: 1; }
.v-leave-active { transition: opacity 1s }
.v-leave-to { opacity: 0; }
.v-enter { opacity: 0; }
.v-enter-active  { transition: opacity 1s }
.v-enter-to { opacity: 1; }
</style>
