<template>
  <foreignObject
    :x="nodeX - 30"
    :y="nodeY + parentVerticalMiddlePoint - 12.5"
    width="25px"
    height="25px"
    style="cursor:pointer;"
    @click="iconClicked">

  <template v-if="chosenIcon !== 'unclicked'">

    <component :is="chosenIcon"></component>

  </template>
  <template v-else>

   <font-awesome-layers
     class="icon">
      <font-awesome-icon
        ref="icon"
        :icon="unclickedIcon">
      </font-awesome-icon>
   </font-awesome-layers>

  </template>

  </foreignObject>
</template>

<script>
import { faMeh } from '@fortawesome/free-regular-svg-icons'

import Excited from '../assets/smiley-excited.svg';
import Relaxed from '../assets/smiley-relaxed.svg';
import Bored from '../assets/smiley-bored.svg';
import Anxious from '../assets/smiley-anxious.svg';
import Meh from '../assets/smiley-bored.svg';

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
  components: {
    excited: Excited,
    relaxed: Relaxed,
    bored: Bored,
    anxious: Anxious,
    unclicked: Meh,
  },
  data() {
    return {
      localClicked: false,
      iconHeight: 0,
      icons: [
        'unclicked',
        'excited',
        'relaxed',
        'bored',
        'anxious',
      ],
      unclickedIcon: faMeh,
    };
  },
  created() {},
  mounted() {},
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
    color: #aaaaaa;
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
