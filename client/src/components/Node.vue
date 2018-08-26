<template>
  <svg class="node-container-svg"
       :x="x"
       :y="y">

    <!-- 0 px from top -->
    <text id="course-name"
          x="25"
          y="0"
          font-size="12">{{ nodeTitle }}</text>

    <!-- 10 px from top -->
    <!-- this is the background of the course -->
    <rect id="background-rect"
          ref="container"
          x="0"
          y="10"
          rx="10"
          ry="10"
          width="250"
          :height="contentHeightPlusMargin"
          :stroke=" type === 'PARENT' ? 'blue' : 'orange'"
          stroke-width="2"
          fill="white"></rect>

    <smiley
      :parent-id="id"
      :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2"
          ></smiley>
    <star
      :parent-id="id"
      :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2"
          ></star>

    <!-- this is the plus/minus sign on the right side -->
    <!-- y = background-rect top + half of height - half of own height -->
    <svg x="255"
         :y="10 + (contentHeightPlusMargin) / 2 - 20"
         width="20px"
         height="20px"
         style="overflow:visible;">

      <foreignObject width="100" height="100" x="0" y="0">
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

      <!-- TODO: think about refactoring this
                 should all showCommentsAdder logic be inside the comments component?

                 eg.

                 component always shows the adder if its comment count === 0 or if localShowAdder === true
                 => new comments would be added by clicking inside the component itself
      -->

      <comments
        :parent-id="id"
        :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2">
      </comments>

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
    <g id="g-content"
       ref="gContent">

      <text id="course-name"
            style="pointer-events:none;"
            contentEditable="true"
            x="25"
            y="30"
            font-size="20"> {{ name }} </text>
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
    pageMargins: {
      type: Number,
      required: true,
    },
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
      containerWidth: 0,
      containerHeight: 0,
      mouseIsDown: false,
      contentHeight: 250,
      contentHeightPlusMargin: 250,
      newNodeName: '',
      showWarning: false,
      isMoving: false,
      hideComments: false,
      showNewNodeAdder: false,
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
      dragSelection.classed("dragging", true);

      event.on("drag", dragged).on("end", ended);

      function dragged() {
        const x = event.sourceEvent.clientX;
        const y = event.sourceEvent.clientY;
        that.$store.commit('MOVE_OBJECT_TO', {
          objectId: that.id,
          newX: x,
          newY: y,
        });
      }

      function ended() {
        dragSelection.classed("dragging", false);
        that.$store.dispatch('USERLOG_SAVE_NODE_LOCATION', {
          id: that.id,
          x: that.x,
          y: that.y,
        });
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
      return comments.length > 0;
    },
    connectionIsBeingAdded() {
      // if this holds true, show a "Connect here" tooltip instead of
      // "Add link" with the linkIcon
      return !!this.$store.state.overlay.connectionFrom &&
        this.$store.state.overlay.connectionFrom !== this.id;
    },
  },
  methods: {

    addComment() {
      this.$store.commit('ADD_COMMENTS', this.id);
    },
    addLink() {
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
</style>
