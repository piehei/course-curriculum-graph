<template>
  <div ref="container"
       class="outer-container">

    <h1 style="text-align:center;">New comment</h1>
    <button @click="cancel" class="close">X</button>
    <hr></hr>
    <br><br>
    <div class="content">
    <div class="left-panel">

      <template v-if="node">

        Selected node:
        <span style="float:right;font-style:italic;font-weight:bold;">
          <a href="" @click.prevent="nodeId = undefined">change</a>
        </span>
        <br>
        <br>

        <div class="node">
          {{ node.name }}
        </div>

        <div style="margin-top: 20px;">

          <template v-if="comments.length === 0">
            The node does not have any previous comments.
          </template>
          <template v-else>

            Previous comments in this node:<br>

            <ul class="comments-ul">
              <template v-for="c in comments">
                <li :key="c.comment_id"
                    :class="`comment-${c.type}`">
                  {{ c.text }}
                  <font-awesome-icon
                    :icon="trash"
                    size="xs"
                    style="cursor:pointer;float:right;"
                    @click="deleteComment(c.comment_id)"></font-awesome-icon>
                </li>
              </template>
            </ul>
          </template>
        </div>
      </template>
      <template v-else>

        Select node for adding comments:
        <br><br>

        <select v-model="nodeId">
          <option disabled value="">Please select one</option>
          <template v-for="n in nodes">
            <option
              :key="n.id"
              :value="n.id">{{ n.name }}</option>
          </template>
        </select>

      </template>

    </div>


    <div class="right-panel">

      Select type for the new comment:
      <br><br>

      <template v-for="type in types">
        <div class="choice"
             :class="{ 'selected': type === newCommentType }"
             :key="type">
          <label class="type-label"
                 :for="`type-${type}`"
                 :key="`type-${type}-for`"
                 :class="`comment-${type}`">
            <input type="radio"
                   class="type-radio"
                   :key="`type-${type}-input`"
                   :id="`type-${type}`"
                   :value="type"
                   v-model="newCommentType">
            {{ type }}
          </label>
          <ul>
            <li v-for="ex in examples[type]" :key="ex">
              {{ ex }}
            </li>
          </ul>
        </div>
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

      <template v-if="success">
        <br><br>
        Comment added! You can add a new one or close this window.
      </template>
    </div>


  </div>
  </div>
</template>
<script>
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'comment-adder',
  props: {
  },
  components: {},
  data() {
    return {
      height: 0,
      newCommentText: '',
      newCommentType: 'note',
      trash: faTrash,
      types: [ "expectation", "note", "reflection" ],
      examples: {
        'expectation': [
          'I would like to ask about this topic,...',
          'I expect this topic to...'],
        'note': [
          'I evaluated my competence as high/low, because...',
          'I felt excited/relaxed/bored/anxious, because...'],
        'reflection': [
          `This topic's significance for me personally is that...`,
          'I could apply this knowledge...'],
      },
      errorMsg: undefined,
      nodeId: undefined,
      success: false,
    }
  },
  watch: {},
  created() {

    // when the overlay is opened state.overlay.commentNodeId
    // defines which node was clicked
    // --> the value is undefined in case of opening the overlay from
    //     global "add comments" button
    // state.overlay.commentNodeId will always be reset when overlay closes
    if (this.$store.state.overlay.commentNodeId) {
      this.nodeId = this.$store.state.overlay.commentNodeId;
    }
  },
  mounted() {},
  computed: {
    node() {
      return this.$store.getters.nodes.filter(n => n.id === this.nodeId)[0];
    },
    nodes() {
      return this.$store.getters.nodes;
    },
    comments() {
      return this.$store.getters.commentsByNodeId(this.nodeId);
    },
  },
  methods: {
    add() {

      if (!this.newCommentType) {
        this.errorMsg = "You have to choose a type!"
        return;
      }

      if (this.newCommentText.length < 3) {
        this.errorMsg = "Text must be longer than 3 characters"
        return;
      }

      if (!this.nodeId) {
        this.errorMsg = "You must choose a node first!"
        return;
      }

      this.errorMsg = undefined;

      this.$store.dispatch('USERLOG_ADD_COMMENT_TO_NODE', {
        nodeId: this.nodeId,
        text: this.newCommentText,
        type: this.newCommentType,
      })

      this.newCommentType = "";
      this.newCommentText = "";
      this.success = true;

      this.cancel();
    },

    cancel() {
      this.$store.commit('CLOSE_OVERLAY');
    },

    deleteComment(cid) {
      // TODO: THIS IS A BAD BAD HACK -> SHOULD INCORPORATE IDs or so, not by text
      this.$store.dispatch('USERLOG_DELETE_COMMENT_FROM_NODE', {
        nodeId: this.nodeId,
        commentId: cid,
      })
    },
  },
}
</script>
<style scoped>

.left-panel {
  width: 40%;
}

.node {
  padding: 10px;
  background: orange;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 800;
}

.right-panel {
  width: 40%;
}

.choice {
  margin: 15px;
  border: 1px dashed grey;
  padding-top: 5px;
}

.selected {
  border: 1px solid black;
}

.type-label {
  padding: 5px;
  margin-left: 20px;
}

.type-radio {
  vertical-align: text-bottom;
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
.close {
  position: absolute;
  right: 20px;
  top: 20px;
}

</style>
