<template>
  <foreignObject
    :x="nodeX - 60"
    :y="nodeY + parentVerticalMiddlePoint - 13.5"
    height="25px"
    width="28px">
    <font-awesome-layers
      class="icon"
      :class="{ 'clicked': clicked,
                'red': chosenIcon.type === 'empty',
                'orange': chosenIcon.type === 'half',
                'green': chosenIcon.type === 'full'}">
      <font-awesome-icon
        ref="icon"
        :icon="chosenIcon.icon"
        @click="iconClicked">
      </font-awesome-icon>
    </font-awesome-layers>
  </foreignObject>
</template>

<script>
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'star-clicker',
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
        { type: 'empty_unclicked',
          icon: faStar },
        { type: 'empty',
          icon: faStar },
        { type: 'half',
          icon: faStarHalfAlt },
        { type: 'full',
          icon: faStarSolid },
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
      return this.$store.getters.moodByTypeAndNode('star', this.parentId);
    },

    chosenIcon() {
      return this.icons[this.currentIndx];
    },

    clicked() {
      return (this.parentId in this.$store.getters.moods.star);
    },
  },
  methods: {

    iconClicked() {
      const newIndx = (this.currentIndx + 1) % this.icons.length;
      this.$store.dispatch('USERLOG_MOOD_CLICKED', { type: 'STAR', nodeId: this.parentId, indx: newIndx });
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
