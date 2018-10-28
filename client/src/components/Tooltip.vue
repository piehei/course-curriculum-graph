<template>
  <div class="tooltip">
    <slot></slot>
    <span :class="`tooltiptext tooltip-${direction} ${size ? size : ''}`"
          :style="`width:${width}px`">
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
    },
    width: {
      type: Number,
      required: false,
    },
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

.icon-row {
  margin: 20px;
}

.small {
  width: 100px;
  padding: 3px 0;
  font-size: 12px;
}

/* Tooltip container */
.tooltip {
    position: relative;
    display: inline-block;
    pointer-events: all;
}

/* Tooltip text */
.tooltip .tooltiptext {
    /* visibility: hidden;
    opacity: 0; */
    display: none;
    position: absolute;
    width: 140px;
    background-color: white;
    color: black;
    border: 2px solid #bebebe;
    text-align: center;
    padding: 5px 5px;
    border-radius: 6px;
    z-index: 1;
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
    /* visibility: visible;
    opacity: 1; */
    display: block;
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
