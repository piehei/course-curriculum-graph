
<template>


  <path :d="`M ${x1 + rand1} ${y1 - rand2}
             l ${ sign * Math.abs(x1 - x2 + rand1) / 2 } 0
             l 0 ${y2 - y1 + rand2}
             L ${x2 - rand1} ${y2 + rand2}`"
        fill="transparent"
        stroke="black"
        stroke-width="1"
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
    }
  },
  components: {},
  data() {
    return {
      deltaX: 125,
      deltaY: 60,
      rand1: Math.floor(Math.random() * 4),
      rand2: Math.floor(Math.random() * 5),
    };
  },
  created() {},
  computed: {

    posFrom() {
      return this.$store.getters.posById(this.from);
    },
    posTo() {
      return this.$store.getters.posById(this.to);
    },

    sizeFrom() {
      return this.$store.getters.containerSize(this.from);
    },
    sizeTo() {
      return this.$store.getters.containerSize(this.to);
    },

    sign() {
      return this.x1 > this.x2 ? -1 : 1
    },

    x1() {
        return this.middle(this.from).x;
    },
    y1() {
      return this.middle(this.from).y;
    },
    x2() {
      return this.middle(this.to).x;
    },
    y2() {
      return this.middle(this.to).y;
    },
    dashParams() {
      if (this.to[0] === this.from[0]) {
        return "0,0";
      }
      return "2,2";
    },
  },
  methods: {

    middle(id) {
      return this.$store.getters.middlePointById(id);
    },
  },
}
</script>
<style scoped>

</style>
