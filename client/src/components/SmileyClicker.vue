<template>
  <foreignObject
    :x="nodeX - 30"
    :y="nodeY + 12"
    width="25px"
    height="25px">
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
    nodeX() {
      return this.$store.getters.posById(this.parentId).x;
    },
    nodeY() {
      return this.$store.getters.posById(this.parentId).y;
    },

    y() {
      return this.parentVerticalMiddlePoint - this.iconHeight / 2;
    },

    currentIndx() {
      return this.$store.getters.moodByTypeAndNode('smiley', this.parentId);
    },

    chosenIcon() {
      return this.icons[this.currentIndx];
    },

    clicked() {
      return this.parentId in this.$store.getters.moods.smiley;
    }
  },
  methods: {

    iconClicked() {
      const newIndx = (this.currentIndx + 1) % this.icons.length;
      this.$store.dispatch('USERLOG_MOOD_CLICKED', { type: 'SMILEY', nodeId: this.parentId, indx: newIndx });
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

  .clickable:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left:0;
  }
</style>
