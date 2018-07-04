<template>
  <div class="tooltip">
    <slot></slot>
    <span :class="`tooltiptext tooltip-${direction} ${size ? size : ''}`">
        <slot name="text"></slot>
      </span>
  </div>
</template>
<script>
export default {
  name: 'Tooltip',
  props: {
    direction: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
    }
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {},
}
</script>
<style scoped>

.small {
  width: 100px;
  padding: 3px 0;
  font-size: 12px;
}

/* Tooltip container */
.tooltip {
    position: relative;
    display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    position: absolute;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    z-index: 1;
    opacity: 0;
}

/* Tooltip arrow
.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}
*/

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}

.tooltip-top {
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
}
.tooltip-right {
  top: -5px;
  left: 125%;
}
.tooltip-bottom {
  top: 135%;
  left: 50%;
  margin-left: -60px;
}
.tooltip-left {
  top: -5px;
  bottom: auto;
  right: 128%;
}
</style>
