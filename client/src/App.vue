<template>
  <div id="page-outer-container">
    <button id="reset-state"
            @click="resetState">
      Reset
    </button>


    <svg width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg">


      <template v-for="c in connections">
        <connection
          :from="c.from"
          :to="c.to"
          :key="c.from + c.to"
          v-if="visible(c)"
          ></connection>
      </template>


      <template v-for="c in courses">
       <course :key="c.id"
                :id="c.id"
                :name="c.name"
                :pageMargins="pageMargins"
                :startX="c.x"
                :startY="c.y"
                :topicsList="c.topics"
                ></course>

         <!-- <movable :key="c.id"
                :id="c.id"
                :name="c.name"
                :pageMargins="pageMargins"
                :startX="c.startX"
                :startY="c.startY"
                >
          <course-content></course-content>
        </movable>
         -->
      </template>

    </svg>

  </div>
</template>
<script>
import Course from './components/Course.vue';
import Connection from './components/Connection.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    course: Course,
    connection: Connection,
  },
  data() {
    return {
      pageMargins: 35,
      courses: this.$store.state.courseList,
      connections: this.$store.getters.baseConnections,
    }
  },
  created() {},
  computed: {},
  methods: {

    resetState() {
      localStorage.clear();
      window.location.reload();
    },

    visible(connection) {
      return true; // this.$store.getters.connectionEndMoving(connection);
    },

},
}
</script>
<style scoped>

  #page-outer-container {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 25px;
  }

  #reset-state {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  svg {
    user-select: none;
  }
</style>
