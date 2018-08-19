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
        :icon="icons.star"
        size="2x">
      </font-awesome-icon>
      <template slot="text">
        Star icon indicates how well you learned the topic
      </template>
    </tooltip>

    <br><br>

    <tooltip direction="right" :width="200">
      <font-awesome-icon
        :icon="icons.smile3"
        size="2x"
        class="fix-horizontal-position"
        @click="add('link')">
      </font-awesome-icon>

      <template slot="text">
        Smiley icon indicates how interesting you found the topic
        <br>
        <font-awesome-icon
          :icon="icons.smile1"
          size="2x"
          style="margin:5px 10px;color:#ff5722;"
          class="fix-horizontal-position">
        </font-awesome-icon>
        <font-awesome-icon
          :icon="icons.smile2"
          size="2x"
          style="margin:5px 10px;color:orange;"
          class="fix-horizontal-position">
        </font-awesome-icon>
        <font-awesome-icon
          :icon="icons.smile3"
          size="2x"
          style="margin:5px 10px;color:green;"
          class="fix-horizontal-position">
        </font-awesome-icon>
      </template>

    </tooltip>

  </div>

</template>
<script>
import { faLink, faStar } from '@fortawesome/free-solid-svg-icons';
import { faComment, faMeh, faFrown, faSmile } from '@fortawesome/free-regular-svg-icons';

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
      },
    };
  },
  methods: {
    add(type) {
      if (type === 'comment') {
        this.$store.commit('ADD_COMMENTS', undefined);
      }
      if (type === 'link') {
        this.$store.commit('ADD_LINKS', undefined);
      }
    },
  },
}
</script>
<style scoped>
#top-buttons {
  position: absolute;
  top: 10px;
  left: 10px;
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

</style>
