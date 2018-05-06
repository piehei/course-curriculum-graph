<template>
  <div id="page-outer-container">

    <svg width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg">

      <template v-for="c in courses">
        <course :key="c.name"
                :name="c.name"
                :pageMargins="pageMargins"
                :startX="c.startX"
                :startY="c.startY"
                ></course>
      </template>

    </svg>

  </div>
</template>
<script>
import Course from './Course.vue';

export default {
  name: 'Page',
  props: [],
  components: {
    course: Course,
  },
  data() {
    return {
      pageMargins: 35,
      courses: [
        {
          name: 'WSD',
          startX: 100,
          startY: 100,
        }
      ]
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
    background: lightgrey;
    padding: 25px;
  }


</style>
