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

    <handle
       :drag-rect-x="4"
       :drag-rect-y="10"
       :width="250 - 8"
       :height="contentHeightPlusMargin"
       :curr-x="x"
       :curr-y="y"
       :id="id"
       ></handle>


    <smiley
      :parent-id="id"
      :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2"
          ></smiley>

    <!-- this is the plus/minus sign on the right side -->
    <!-- y = background-rect top + half of height - half of own height -->
    <svg x="255"
         :y="10 + (contentHeightPlusMargin) / 2 - 10"
         width="20px"
         height="20px">
      <font-awesome-icon
        :icon="showAdder ? minus : plus">
      </font-awesome-icon>
      <rect
        width="20px"
        height="20px"
        style="opacity:0;cursor:pointer;"
        @click="toggleShowAdder">
      </rect>
    </svg>

    <template v-if="showAdder">

      <foreignObject
        x="285"
        :y="10 + contentHeightPlusMargin / 2 - 20">
        <div>
            <button @click="showNewNodeAdder = !showNewNodeAdder; showAdder = !showAdder">Topic</button>
            <button @click="addComments">Comments</button>
        </div>
      </foreignObject>

    </template>

    <template v-if="showComments">

      <!-- TODO: think about refactoring this
                 should all showCommentsAdder logic be inside the comments component?

                 eg.

                 component always shows the adder if its comment count === 0 or if localShowAdder === true
                 => new comments would be added by clicking inside the component itself
      -->

      <comments
        :parent-id="id"
        :parent-vertical-middle-point="10 + contentHeightPlusMargin / 2"
        :show-comments-adder.sync="showCommentsAdder"></comments>

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
import { faPlus, faMinus } from '@fortawesome/fontawesome-free-solid'

import Handle from './Handle.vue';
import Comments from './Comments.vue';
import SmileyClicker from './SmileyClicker.vue';

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
    handle: Handle,
    comments: Comments,
    smiley: SmileyClicker,
  },
  data() {
    return {
      plus: faPlus,
      minus: faMinus,
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
      showAdder: false,
      showCommentsAdder: false,
      showNewNodeAdder: false,
    }
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
      if (this.showAdder) {
        return false;
      }
      const comments = this.$store.getters.commentsByNodeId(this.id);
      return comments.length > 0 || this.showCommentsAdder;
    },
  },
  methods: {

    addComments() {
      this.showAdder = false;
      this.$store.commit('ADD_COMMENTS', this.id);
    },

    inputEditingEnter() {
      if (this.newNodeName.length < 1) {
        this.showWarning = true;
        return;
      }

      this.$store.commit('ADD_NEW_NODE', {
        parentId: this.id,
        name: this.newNodeName,
        x: this.x + 300,
        y: this.y,
      });

      this.newNodeName = "";
      this.showNewNodeAdder = false;
    },
    toggleNewCommentAdder() {
      this.showCommentsAdder = !this.showCommentsAdder;
    },
    toggleShowAdder() {
      // do nothing if comment adding is open
      if (!this.showCommentsAdder) {
        this.showAdder = !this.showAdder;
      }
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
