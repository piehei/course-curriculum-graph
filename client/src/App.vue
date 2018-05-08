<template>
  <div id="page-outer-container">

    <svg width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg">

      <template v-for="c in courses.slice(0,1)">
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
import Movable from './components/Movable.vue';
import CourseContent from './components/CourseContent.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    course: Course,
    movable: Movable,
    courseContent: CourseContent,
  },
  data() {
    return {
      pageMargins: 35,
      courses: this.$store.state.courseList,
    }
  },
  created() {},
  computed: {},
  methods: {},
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
  svg {
    user-select: none;
  }
</style>
