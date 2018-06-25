
<template>
<foreignObject
  x="285"
  :y="y"
  width="200px"
  :height="height"
  >
  <div ref="container"
       class="comments-outer-container">

    <template v-if="showCommentsAdder">
      <div style="text-align:center">
        Select type:
        <br>

        <template v-for="type in types">
          <input type="radio" :key="`type-${type}-input`" :id="`type-${type}`" :value="type" v-model="newCommentType">
          <label :for="`type-${type}`" :key="`type-${type}-for`" :class="`comment-${type}`">{{type}}</label>
        </template>

        <br><br>

        Text:
        <br>
        <textarea style="width:90%;padding:5px;" v-model="newCommentText" placeholder="write here"></textarea>


        <template v-if="errorMsg">
          <br><br>
          {{ errorMsg }}
        </template>
        <br><br>
        <button class="cancel" @click="cancel">cancel</button>
        <button class="add" @click="add">add comment</button>
      </div>
    </template>

    <template v-else>
      <ul class="comments-ul">
        <template v-for="c in comments">
          <li :key="c.text"
              :class="`comment-${c.type}`">
            {{ c.text }}
            <font-awesome-icon
              :icon="trash"
              size="xs"
              style="cursor:pointer;float:right;"
              @click="deleteComment(c.text)"></font-awesome-icon>
          </li>
        </template>
      </ul>
    </template>

  </div>
</foreignObject>
</template>
<script>
import { faTrash } from '@fortawesome/fontawesome-free-solid'

export default {
  name: 'comments',
  props: {
    parentId: {
      type: String,
      required: true,
    },
    showCommentsAdder: {
      type: Boolean,
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
    showCommentsAdder() {
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
        const rect = this.$refs['container'];
        this.height = rect.offsetHeight;
      })
    },
    add() {

      if (!this.newCommentType) {
        this.errorMsg = "You have to choose a type!"
        return;
      }

      if (this.newCommentText.length < 3) {
        this.errorMsg = "Text must be longer than 3 characters"
        return;
      }

      this.errorMsg = undefined;

      this.$store.commit('ADD_COMMENT_TO_NODE', {
        nodeId: this.parentId,
        text: this.newCommentText,
        type: this.newCommentType,
      })

      this.$emit('update:showCommentsAdder', false);
      this.newCommentType = "";
      this.newCommentText = "";
    },
    deleteComment(text) {
      // TODO: THIS IS A BAD BAD HACK -> SHOULD INCORPORATE IDs or so, not by text
      this.$store.commit('DELETE_COMMENT_FROM_NODE', {
        nodeId: this.parentId,
        text: text,
      })
    },
    cancel() {
      this.$emit('update:showCommentsAdder', false);
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
