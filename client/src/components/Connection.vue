<template>
  <path :d="pathString"

        fill="transparent"
        :stroke="userAdded ? 'green' : '#9e9e9e'"
        stroke-width="3px"
        :stroke-dasharray="dashParams">
  </path>
</template>
<script>
export default {
  name: 'connection',
  props: {
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
  },
  components: {},
  data() {
    return {
      deltaX: 125,
      deltaY: 60,
    };
  },
  computed: {
    pathString() {
      const shape = this.$store.state.UI.pathShape;
      const x1 = this.x1;
      const y1 = this.y1;
      const x2 = this.x2;
      const y2 = this.y2;

      if (this.toMouseMode) {
        // straight line
        return `M ${x1} ${y1} L ${x2} ${y2}`;
      }

      const rand1 = Math.floor(Math.random() * 4);
      const rand2 = Math.floor(Math.random() * 5);
      const sign = x1 > x2 ? -1 : 1

      if (shape === 'curve') {
        // curve is consctructed as follows:
        // M x1 x2 Q x y x2 y2
        // where x y stands for the slope
        // here we make the slope steeper(?) if the nodes are very adjancent to eache other
        return `M ${x1} ${y1}
                Q ${x1 + (x2-x1)/2 + (Math.abs(x1-x2) < 50 ? 50 : 0)} ${y1 + (y1 > y2 ? -100 : 100) + (y2-y1)/2}
                ${x2} ${y2}`

      } else if (shape === 'path') {

        return `M ${x1 + rand1} ${y1 - rand2}
                 l ${ sign * Math.abs(x1 - x2 + rand1) / 2 } 0
                 l 0 ${y2 - y1 + rand2}
                 L ${x2 - rand1} ${y2 + rand2}`;

      } else {

        return `M ${x1} ${y1} L ${x2} ${y2}`;

      }
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
  },
  methods: {

    middle(id) {
      return this.$store.getters.middlePointById(id);
    },
  },
};
</script>
<style scoped>
</style>
