<template>
  <div id="top-buttons">

    <tooltip direction="right">
      <font-awesome-icon
        :icon="icons.comment"
        size="2x"
        class="fix-horizontal-position"
        @click="add('comment')">
      </font-awesome-icon>
      <template slot="text">
        Add new comment
      </template>
    </tooltip>

    <br><br>

    <tooltip direction="right">
      <font-awesome-icon
        :icon="icons.link"
        size="2x"
        class="fix-horizontal-position"
        @click="add('link')">
      </font-awesome-icon>
      <template slot="text">
        Add new connection
      </template>
    </tooltip>

    <br><br>
    <tooltip direction="right">
      <font-awesome-icon
        :icon="icons.eraser"
        size="2x"
        class="fix-horizontal-position"
        :class="{ 'delete-mode': deleteMode }"
        @click="toggleDeleteMode">
      </font-awesome-icon>
      <template slot="text">
        Erase connection added by you
      </template>
    </tooltip>

    <br><br>

    <tooltip direction="right" :width="260">
      <font-awesome-icon
        :icon="icons.star"
        size="2x">
      </font-awesome-icon>
      <template slot="text">
        <b><i>I think my competence in this topic is</i></b>
        <div style="display:flex;justify-content:center;">
        <div>
          <font-awesome-icon
            :icon="icons.star1"
            size="2x"
            style="margin:5px 10px;color:grey;"
            class="fix-horizontal-position">
          </font-awesome-icon>
          <br>
          Low
        </div>
        <div>
          <font-awesome-icon
            :icon="icons.star2"
            size="2x"
            style="margin:5px 10px;color:grey;"
            class="fix-horizontal-position">
          </font-awesome-icon>
          <br>
          Medium
        </div>
        <div>
          <font-awesome-icon
            :icon="icons.star3"
            size="2x"
            style="margin:5px 10px;color:grey;"
            class="fix-horizontal-position">
          </font-awesome-icon>
          <br>
          High
        </div>
        </div>
      </template>
    </tooltip>

    <br><br>

    <tooltip direction="right" :width="250">
      <font-awesome-icon
        :icon="icons.smile3"
        size="2x"
        class="fix-horizontal-position"
        @click="add('link')">
      </font-awesome-icon>

      <template slot="text">
        <b><i>While studying this topic, I felt</i></b>
        <br>

        <div style="display:flex;justify-content:center;">
          <div class="smiley-outer-cont">
            <div class="smiley-cont">
              <excited />
            </div>
            Excited
          </div>
          <div class="smiley-outer-cont">
            <div class="smiley-cont">
              <relaxed />
            </div>
            Relaxed
          </div>
          <div class="smiley-outer-cont">
            <div class="smiley-cont">
            <bored />
            </div>
            Bored
          </div>
          <div class="smiley-outer-cont">
            <div class="smiley-cont">
            <anxious />
            </div>
            Anxious
          </div>
        </div>


      </template>

    </tooltip>

  </div>

</template>
<script>
import { faLink, faStarHalfAlt, faStar as faStarSolid, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faComment, faMeh, faFrown, faSmile, faStar } from '@fortawesome/free-regular-svg-icons';

import Excited from '../assets/smiley-excited.svg';
import Relaxed from '../assets/smiley-relaxed.svg';
import Bored from '../assets/smiley-bored.svg';
import Anxious from '../assets/smiley-anxious.svg';

export default {
  name: 'global-icons',
  data() {
    return {
      icons: {
        link: faLink,
        comment: faComment,
        star: faStar,
        smile1: faFrown,
        smile2: faMeh,
        smile3: faSmile,
        star1: faStar,
        star2: faStarHalfAlt,
        star3: faStarSolid,
        eraser: faEraser,
      },
    };
  },
  components: {
    excited: Excited,
    relaxed: Relaxed,
    bored: Bored,
    anxious: Anxious,
  },
  methods: {
    add(type) {
      if (type === 'comment') {
        this.$store.commit('ADD_COMMENTS', undefined);
      }
      if (type === 'link') {
        this.$store.commit('ADD_LINKS');
      }
    },

    toggleDeleteMode() {
      this.$store.commit('TOGGLE_DELETE_MODE');
    },
  },

  computed: {
    deleteMode() {
      return this.$store.state.UI.deleteMode;
    },
  }
}
</script>
<style scoped>

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(0);
  }
}

#top-buttons {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: 1s ease-out 0s 1 slideInFromLeft;
}

#top-buttons svg {
  cursor: pointer;
}

/* the star icon is 36*32 px and the rest
   are 32*32. this compensates and makes
   the rest wider so the align nicely. */
.fix-horizontal-position {
  margin-left: 2px;
}

.delete-mode {
  color: red;
}
.smiley-outer-cont {
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.smiley-cont {
  width: 2.5em;
  height: 2.5em;
}

</style>
