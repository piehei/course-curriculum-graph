
<template>
  <div ref="container"
       class="comments-outer-container">

    <div class="left-panel">
      <h3>You're connecting these nodes:</h3>
      <br>

      <template v-if="fromNode">
        <span style="float:right;font-style:italic;font-weight:bold;">
          <a href="" @click.prevent="fromId = undefined">change</a>
        </span>
        <br><br>
        <div class="node">
          {{ fromNode.name }}
        </div>
      </template>

      <template v-else>
        Select node for a new connection:
        <br><br>
        <select v-model="fromId">
          <option disabled value="">Please select one</option>
          <template v-for="n in nodes.filter(n => n.id !== toId)">
            <option
              :key="n.id"
              :value="n.id">{{ n.name }}</option>
          </template>
        </select>
      </template>
      <br><br>
      <template v-if="toNode">
        <span style="float:right;font-style:italic;font-weight:bold;">
          <a href="" @click.prevent="toId = undefined">change</a>
        </span>
        <br><br>
        <div class="node">
          {{ toNode.name }}
        </div>
      </template>

      <template v-else>
        Select node for a new connection:
        <br><br>
        <select v-model="toId">
          <option disabled value="">Please select one</option>
          <template v-for="n in nodes.filter(n => n.id !== fromId)">
            <option
              :key="n.id"
              :value="n.id">{{ n.name }}</option>
          </template>
        </select>
      </template>

    </div>


    <div class="right-panel">
      Describe here briefly why you're connecting the nodes:
      <br>
      <textarea style="width:90%;padding:5px;" v-model="newCommentText" placeholder="write here"></textarea>

      <template v-if="errorMsg">
        <br><br>
        {{ errorMsg }}
      </template>
      <br><br>
      <button class="cancel" @click="cancel">cancel</button>
      <button class="add" @click="add">add new connection</button>
    </div>


  </div>
</template>
<script>
import { faTrash } from '@fortawesome/fontawesome-free-solid'

export default {
  name: 'comment-adder',
  props: {
  },
  components: {},
  data() {
    return {
      height: 0,
      newCommentText: '',
      errorMsg: undefined,
      fromId: undefined,
      toId: undefined,
    }
  },
  watch: {},
  created() {

    // when the overlay is opened state.overlay.commentNodeId
    // defines which node was clicked
    // --> the value is undefined in case of opening the overlay from
    //     global "add comments" button
    // state.overlay.commentNodeId will always be reset when overlay closes
    if (this.$store.state.overlay.connectionFrom) {
      this.fromId = this.$store.state.overlay.connectionFrom;
    }
    if (this.$store.state.overlay.connectionTo) {
      this.toId = this.$store.state.overlay.connectionTo;
    }
  },
  mounted() {},
  computed: {
    fromNode() {
      return this.$store.getters.nodes.filter(n => n.id === this.fromId)[0];
    },
    toNode() {
      return this.$store.getters.nodes.filter(n => n.id === this.toId)[0];
    },
    nodes() {
      return this.$store.getters.nodes;
    },
  },
  methods: {
    add() {

      if (this.newCommentText.length < 3) {
        this.errorMsg = "Text must be longer than 3 characters"
        return;
      }

      if (!this.fromId || !this.toId) {
        this.errorMsg = "You must choose the nodes first!"
        return;
      }

      this.errorMsg = undefined;

      this.$store.commit('ADD_CONNECTION_WITH_COMMENT', {
        from: this.fromId,
        to: this.toId,
        text: this.newCommentText,
      })

      this.cancel();
    },

    cancel() {
      this.$store.commit('CLOSE_OVERLAY');
    },
  },
}
</script>
<style scoped>
.comments-outer-container {
  border: 1px solid #9e9e9e;
  width: 95%;
  height: 90%;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 2px 2px #00bcd44d;
  padding: 25px 5px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

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
  margin-top: 150px;
}

.choice {
  margin: 15px;
}

.type-label {
  padding: 5px;
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

</style>
