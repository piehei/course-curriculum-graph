<template>
  <svg class="node-container-svg"
       :x="x"
       :y="y">

      <text id="course-name"
            x="25"
            y="25"
            font-size="14">{{ nodeTitle }}</text>

    <!-- this is the background of the course -->
    <rect id="background-rect"
          ref="container"
          x="0"
          y="30"
          rx="10"
          ry="10"
          width="250"
          :height="bgRectHeight + 40"
          :stroke=" type === 'PARENT' ? 'blue' : 'orange'"
          stroke-width="2"
          fill="white"></rect>
    <handle
       :drag-rect-x="4"
       :drag-rect-y="34"
       :width="250 - 8"
       :height="bgRectHeight + 40 - 8"
       :curr-x="x"
       :curr-y="y"
       :id="id"
       ></handle>


    <svg x="255" :y="bgRectHeight / 2 + 40" width="20px" height="20px">
      <font-awesome-icon
        :icon="plus"
        style="cursor:pointer;"
        @click="showNewItemAdder">
      </font-awesome-icon>
    </svg>

    <template v-if="showComments">
      <!-- <foreignObject
        x="285"
        :y="bgRectHeight / 2 + 40 + 4"
        width="200px"
        > -->
          <comments
            :parent-id="id"
            :parent-vertical-middle-point="bgRectHeight / 2 + 40 + 8"
            :show-adder.sync="showAdder"></comments>
      <!-- </foreignObject> -->
    </template>


    <!-- this is a group that has all the contents inside the course element -->
    <g id="g-content"
       ref="gContent">


    <template v-if="type === 'NEW_NODE'">

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
    <template v-else>

      <text id="course-name"
            style="pointer-events:none;"
            contentEditable="true"
            x="25"
            y="65"
            font-size="20"> {{ name }} </text>

    </template>
    </g>
  </svg>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlus'

import Handle from './Handle.vue';
import Comments from './Comments.vue'

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
    newNodeX: {
      type: Number,
      required: false,
    },
    newNodeY: {
      type: Number,
      required: false,
    }
  },
  components: {
    handle: Handle,
    comments: Comments,
    fontAwesomeIcon: FontAwesomeIcon,
  },
  data() {
    return {
      plus: faPlusSquare,
      width: 250,
      height: 250,
      containerWidth: 0,
      containerHeight: 0,
      mouseIsDown: false,
      bgRectHeight: 250,
      newNodeName: '',
      showWarning: false,
      isMoving: false,
      hideComments: false,
      showAdder: false,
    }
  },
  mounted() {

    // because of the limitations of SVG sizing
    // the background rect has to be manually sized
    // based on the contents of the content g
    const g = this.$refs.gContent;
    const gBounding = g.getBoundingClientRect();
    this.bgRectHeight = gBounding.height;

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
      if (this.newNodeX) return this.newNodeX;
      return this.$store.getters.posById(this.id).x;
    },
    y() {
      if (this.newNodeY) return this.newNodeY;
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
      console.log('checking')
      return comments.length > 0 || this.showAdder;
    },
  },
  methods: {
    inputEditingEnter() {
      if (this.newNodeName.length < 1) {
        this.showWarning = true;
        return;
      }
      this.$store.commit('ADD_NEW_NODE', {
        name: this.newNodeName,
        x: this.x,
        y: this.y,
      });
      this.$emit('new-node-added');
    },
    toggleComments(evt) {
      evt.stopPropagation();
      this.showComments = !this.showComments;
    },
    showNewItemAdder(evt) {
      evt.stopPropagation();
      this.showAdder = true;
    },
    hideNewItemAdder() {
      this.showAdder = false;
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
