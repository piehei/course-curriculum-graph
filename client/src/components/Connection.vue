<template>
  <g>
  <path :d="pathString"
        class="connection"
        :class="{
                  'user-added': userAdded,
                  'delete-hover': deleteMode && mouseIsHovering
                }"
        :stroke-dasharray="dashParams">
  </path>

  <path v-if="userAdded"
        :d="pathString"
        class="fat-path user-added"
        @click="clicked"
        @mouseover="mouseIsHovering = true"
        @mouseleave="mouseIsHovering = false">
  </path>

  <template v-if="!connectionAddingMode && userAdded && mouseIsHovering">
    <foreignObject :x="commentPos.x"
                   :y="commentPos.y"
                   :width="400"
                   :height="100"
                   style="pointer-events:none;">
      <div class="comment-container">
        {{ comment }}
      </div>
    </foreignObject>

  </template>
  </g>
</template>
<script>
export default {
  name: 'connection',
  props: {
    id: {
      type: String,
      required: false,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    toMouseMode: {
      type: Boolean,
      required: true,
    },
    userAdded: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  components: {},
  data() {
    return {
      mouseIsHovering: false,
      slopeX: 0,
      slopeY: 0,
    };
  },
  computed: {
    commentPos() {
      const x = this.x1 + (this.x2 - this.x1)/2;
      const y = this.y1 + (this.y2 - this.y1)/2;
      return {
        x: x,
        y: y,
      };
    },
    pathString() {
      const x1 = this.x1;
      const y1 = this.y1;
      const x2 = this.x2;
      const y2 = this.y2;

      if (this.toMouseMode) {
        // straight line
        return `M ${x1} ${y1} L ${x2} ${y2}`;
      }

      // curve is consctructed as follows:
      // M x1 x2 Q x y x2 y2
      // where x y stands for the slope
      // here we make the slope steeper(?) if the nodes are very adjacent to each other
      this.slopeX = `${x1 + (x2-x1)/2 + (Math.abs(x1-x2) < 50 ? 50 : 0)}`;
      this.slopeY = `${y1 + (y1 > y2 ? -100 : 100) + (y2-y1)/2}`;
      return `M ${x1} ${y1}
              Q ${this.slopeX} ${this.slopeY}
              ${x2} ${y2}`

    },
    x1() {
        return this.middle(this.from).x;
    },
    y1() {
      return this.middle(this.from).y;
    },
    x2() {
      if (this.toMouseMode) {
        return this.$store.state.UI.mouse.x;
      }
      return this.middle(this.to).x;
    },
    y2() {
      if (this.toMouseMode) {
        return this.$store.state.UI.mouse.y;
      }
      return this.middle(this.to).y;
    },
    dashParams() {
      return "10px 3px";
    },
    deleteMode() {
      return this.userAdded && this.$store.state.UI.deleteMode;
    },
    connectionAddingMode() {
      const overlay = this.$store.state.overlay;
      return overlay.connectionFrom && !overlay.connectionTo;
    },
  },
  methods: {

    clicked() {
      if (this.deleteMode) {
        this.$store.dispatch('USERLOG_DELETE_CONNECTION', { connectionId: this.id });
      }
    },

    middle(id) {
      return this.$store.getters.middlePointById(id);
    },
  },
};
</script>
<style scoped>
.connection {
  pointer-events: none;
  stroke: #9e9e9e;
  fill: transparent;
  stroke-width: 3px;
}
.fat-path {
  stroke-width: 12px;
  stroke: black;
  opacity: 0;
}
.user-added {
  pointer-events: all;
  stroke: green;
}
.delete-hover {
  stroke: red;
  stroke-width: 4px;
  pointer-events: all;
}
.comment-container {
  border: 1px solid grey;
  border-radius: 5px;
  padding: 3px;
  background: white;
}
</style>
