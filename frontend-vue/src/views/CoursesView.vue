<template>
  <div>
    <h1>Course Management</h1>

    <section>
      <h2>Add a Course</h2>

      <form @submit.prevent="addCourse">
        <div>
          <label for="courseId">Course ID:</label>
          <input
            id="courseId"
            v-model.trim="newCourse.courseId"
            required
          />
        </div>

        <div>
          <label for="courseName">Course Name:</label>
          <input
            id="courseName"
            v-model.trim="newCourse.name"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          Add Course
        </button>
      </form>

      <p v-if="formMessage">{{ formMessage }}</p>
    </section>

    <hr />

    <section>
      <h2>Courses List</h2>

      <button @click="loadCourses" :disabled="loading">
        Refresh List
      </button>

      <p v-if="listMessage">{{ listMessage }}</p>

      <ul v-if="courses.length">
        <li v-for="course in courses" :key="course._id">
          {{ course.courseId }} — {{ course.name }}
          <button
            @click="deleteCourse(course.courseId)"
            :disabled="loading"
          >
            Delete
          </button>
        </li>
      </ul>

      <p v-else-if="!listMessage">
        No courses are currently saved.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const courses = ref([])
const loading = ref(false)
const formMessage = ref('')
const listMessage = ref('')

const newCourse = reactive({
  courseId: '',
  name: ''
})

async function loadCourses() {
  try {
    const response = await axios.get(`${API_URL}/courses`)
    courses.value = response.data
    listMessage.value = ''
  } catch (error) {
    listMessage.value =
      error.response?.data?.error ||
      'Could not load courses from the server.'
  }
}

async function addCourse() {
  loading.value = true
  formMessage.value = ''

  try {
    const response = await axios.post(`${API_URL}/courses`, {
      courseId: newCourse.courseId,
      name: newCourse.name
    })

    formMessage.value = response.data.message

    Object.assign(newCourse, {
      courseId: '',
      name: ''
    })

    await loadCourses()
  } catch (error) {
    formMessage.value =
      error.response?.data?.error ||
      'Could not connect to the server.'
  } finally {
    loading.value = false
  }
}

async function deleteCourse(courseId) {
  if (!confirm(`Are you sure you want to delete course ${courseId}?`)) {
    return
  }

  loading.value = true
  formMessage.value = ''

  try {
    const response = await axios.delete(
      `${API_URL}/courses/${encodeURIComponent(courseId)}`
    )

    formMessage.value = response.data.message
    await loadCourses()
  } catch (error) {
    formMessage.value =
      error.response?.data?.error ||
      'Could not connect to the server.'
  } finally {
    loading.value = false
  }
}

onMounted(loadCourses)
</script>
