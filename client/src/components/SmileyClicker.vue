<template>
  <foreignObject
    :x="-5 - iconHeight"
    :y="y"
    :height="'40px'">
    <font-awesome-layers
      class="icon"
      :class="{ 'clicked': clicked,
                'red': chosenIcon.type === 'frown',
                'orange': chosenIcon.type === 'meh',
                'green': chosenIcon.type === 'smile'}">
      <font-awesome-icon
        ref="icon"
        :icon="chosenIcon.icon"
        @click="iconClicked">
      </font-awesome-icon>
    </font-awesome-layers>
  </foreignObject>
</template>

<script>
import { faFrown, faSmile, faMeh } from '@fortawesome/free-regular-svg-icons'

export default {
  name: 'smiley-clicker',
  props: {
    parentId: {
      type: String,
      required: true,
    },
    parentVerticalMiddlePoint: {
      type: Number,
      required: true,
    }
  },
  components: {},
  data() {
    return {
      localClicked: false,
      iconHeight: 0,
      icons: [
        { type: 'meh_unclicked',
          icon: faMeh },
        { type: 'frown',
          icon: faFrown },
        { type: 'meh',
          icon: faMeh },
        { type: 'smile',
          icon: faSmile }
      ]
    };
  },
  created() {},
  mounted() {
    const icon = this.$refs['icon'];
    this.iconHeight = icon.clientHeight;
  },
  computed: {

    y() {
      return this.parentVerticalMiddlePoint - this.iconHeight / 2;
    },

    currentIndx() {
      return this.$store.getters.smileyIndxByNodeId(this.parentId);
    },

    chosenIcon() {
      return this.icons[this.currentIndx];
    },

    clicked() {
      return this.parentId in this.$store.state.smileys;
    }
  },
  methods: {

    iconClicked() {
      const newIndx = (this.currentIndx + 1) % this.icons.length;
      this.$store.commit('SMILEY_CLICKED', { nodeId: this.parentId, indx: newIndx });
    }

  },
}
</script>
<style scoped>

  .icon {
    cursor: pointer;
    color: grey;
    font-size: 25px;
  }

  .red {
    color: #ff5722;
  }

  .orange {
    color: orange;
  }

  .green {
    color: green;
  }

</style>
