<template>
  <foreignObject
    :x="leftSidePos"
    :y="y"
    width="200px"
    :height="height">
    <div ref="container"
         class="comments-outer-container">

      <ul class="comments-ul">
        <template v-for="c in comments">
          <li :key="c.text"
              :class="`comment-${c.comment_type}`">
            {{ c.text }}
            <font-awesome-icon
              :icon="trash"
              size="xs"
              style="cursor:pointer;float:right;"
              @click="deleteComment(c.comment_id)"></font-awesome-icon>
          </li>
        </template>
      </ul>
    </div>
  </foreignObject>
</template>
<script>
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'comments',
  props: {
    parentId: {
      type: String,
      required: true,
    },
    parentVerticalMiddlePoint: {
      type: Number,
      required: true,
    },
    leftSidePos: {
      type: Number,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      height: 0,
      newCommentText: '',
      newCommentType: '',
      trash: faTrash,
      types: [ "expectation", "note", "reflection" ],
      errorMsg: undefined,
    }
  },
  watch: {
    comments() {
      this.updateSize();
    },
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
        const rect = this.$refs['container'];
        this.height = rect.offsetHeight;
      })
    },
    deleteComment(cid) {
      // TODO: THIS IS A BAD BAD HACK -> SHOULD INCORPORATE IDs or so, not by text
      this.$store.dispatch('USERLOG_DELETE_COMMENT_FROM_NODE', {
        nodeId: this.parentId,
        commentId: cid,
      })
    },
  },
}
</script>
<style scoped>
.comments-outer-container {
  border: 1px solid #9e9e9e;
  width: 300px;
  border-radius: 5px;
  box-shadow: 2px 2px #00bcd44d;
  padding: 5px;
  background: white;
}

.comments-ul {
  list-style-type: none;
  padding-left: 0;
}

.comments-ul li {
  padding: 5px;
  margin: 2px 4px;
}

.comment-expectation {
  background: #cddc39;
}

.comment-note {
  background: #ffeb3b;
}

.comment-reflection {
  background: #ffc107;
}

.cancel {
  color: grey;
  margin-right: 0.1rem;
}
.add {
  color: green;
  margin-left: 0.1rem;
}

</style>
