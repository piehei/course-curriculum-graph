
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
        Select type:
        <br>

        <template v-for="type in types">
          <input type="radio" :key="`type-${type}-input`" :id="`type-${type}`" :value="type" v-model="newCommentType">
          <label :for="`type-${type}`" :key="`type-${type}-for`">{{type}}</label>
        </template>

        <br><br>

        Text:
        <br>
        <textarea v-model="newCommentText" placeholder="write your thoughts"></textarea>


        <br><br>
        <template v-if="errorMsg">
          {{ errorMsg }}
        </template>
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
      types: [ "expectation", "notes", "reflection" ],
      errorMsg: undefined,
    }
  },
  watch: {
    comments() {
      this.updateSize();
    },
    showAdder() {
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
