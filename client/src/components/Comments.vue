
<template>
<foreignObject
  x="285"
  :y="y"
  width="200px"
  :height="height"
  >
  <div ref="container"
       class="comments-outer-container">

    <template v-if="showAdder">
      <div style="text-align:center">
        Text:
        <textarea v-model="newCommentText" placeholder="write your thoughts"></textarea>

        <br>
        Type:
        <br>
        <input type="radio" id="one" value="One" v-model="newCommentType">
        <label for="one">One</label>
        <br>
        <input type="radio" id="two" value="Two" v-model="newCommentType">
        <label for="two">Two</label>
        <br>
        <input type="radio" id="three" value="Three" v-model="newCommentType">
        <label for="three">Three</label>

        <br><br>
        <button @click="add">add comment</button>
      </div>
    </template>
    <template v-else>
      <ul>
        <template v-for="c in comments">
          <li>
            {{ c.text }}
            <font-awesome-icon
              :icon="trash"
              size="xs"
              style="cursor:pointer;"
              @click="deleteComment(c.text)"></font-awesome-icon>
          </li>
        </template>
      </ul>
    </template>

  </div>
</foreignObject>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'

export default {
  name: 'comments',
  props: {
    parentId: {
      type: String,
      required: true,
    },
    showAdder: {
      type: Boolean,
      required: true,
    },
    parentVerticalMiddlePoint: {
      type: Number,
      required: true,
    }
  },
  components: {
    fontAwesomeIcon: FontAwesomeIcon,
  },
  data() {
    return {
      height: 0,
      newCommentText: '',
      newCommentType: '',
      trash: faTrash,
    }
  },
  watch: {
    comments() {
      console.log('comments changed')
      this.updateSize();
    },
    showAdder() {
      console.log('show adder changed')
      this.updateSize();
    }
  },
  created() {},
  mounted() {
    this.updateSize();
  },
  computed: {
    comments() {
      return this.$store.getters.commentsByNodeId(this.parentId);
    },
    y() {
      return this.parentVerticalMiddlePoint - this.height/2;
    }
  },
  methods: {
    updateSize() {
      // getting the height from the DOM depends on the DOM being updated
      // --> wait for nextTick (Vue renders) and only then update
      this.$nextTick(() => {
        const rect = this.$refs['container'].getBoundingClientRect();
        this.height = rect.height;
        this.topMargin = - this.height / 2;
      })
    },
    add() {
      this.$store.commit('ADD_COMMENT_TO_NODE', {
        nodeId: this.parentId,
        text: this.newCommentText,
        type: this.newCommentType,
      })
      this.$emit('update:showAdder', false);
    },
    deleteComment(text) {
      // TODO: THIS IS A BAD BAD HACK -> SHOULD INCORPORATE IDs or so, not by text
      this.$store.commit('DELETE_COMMENT_FROM_NODE', {
        nodeId: this.parentId,
        text: text,
      })
    },
  },
}
</script>
<style scoped>
.comments-outer-container {
  border: 1px solid red;
  width: 300px;
}
</style>
