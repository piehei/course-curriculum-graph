
<template>

  <line :x1="posFrom.x + deltaX"
        :y1="posFrom.y + deltaY"
        :x2="posTo.x + deltaX"
        :y2="posTo.y + deltaY"
        stroke="red"
        stroke-width="2">
  </line>


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

  },
  methods: {},
}
</script>
<style scoped>

</style>
