<template>
  <div>
    <h1>Student Enrollment</h1>

    <section>
      <h2>Enroll a Student in a Course</h2>

      <form @submit.prevent="enrollStudent">
        <div>
          <label for="student">Select Student:</label>
          <select id="student" v-model="selectedStudent" required>
            <option value="" disabled>Choose a student</option>
            <option
              v-for="student in students"
              :key="student._id"
              :value="student._id"
            >
              {{ student.name }} (ID: {{ student.id }})
            </option>
          </select>
        </div>

        <div>
          <label for="course">Select Course:</label>
          <select id="course" v-model="selectedCourse" required>
            <option value="" disabled>Choose a course</option>
            <option
              v-for="course in courses"
              :key="course._id"
              :value="course._id"
            >
              {{ course.courseId }} — {{ course.name }}
            </option>
          </select>
        </div>

        <button type="submit" :disabled="loading">
          Enroll Student
        </button>
      </form>

      <p v-if="formMessage">{{ formMessage }}</p>
    </section>

    <hr />

    <section>
      <h2>Course Roster</h2>

      <div>
        <label for="rosterCourse">Select Course:</label>
        <select id="rosterCourse" v-model="rosterCourse">
          <option value="">Choose a course</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseId }} — {{ course.name }}
          </option>
        </select>

        <button
          @click="loadRoster"
          :disabled="loading || !rosterCourse"
        >
          View Roster
        </button>
      </div>

      <p v-if="rosterMessage">{{ rosterMessage }}</p>

      <ul v-if="roster.length">
        <li v-for="enrollment in roster" :key="enrollment._id">
          {{ enrollment.student.name }}
          (ID: {{ enrollment.student.id }})
        </li>
      </ul>

      <p v-else-if="rosterLoaded && !rosterMessage">
        No students are enrolled in this course yet.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const students = ref([])
const courses = ref([])
const selectedStudent = ref('')
const selectedCourse = ref('')
const rosterCourse = ref('')
const roster = ref([])
const rosterLoaded = ref(false)
const loading = ref(false)
const formMessage = ref('')
const rosterMessage = ref('')

async function loadOptions() {
  try {
    const [studentResponse, courseResponse] = await Promise.all([
      axios.get(`${API_URL}/students`),
      axios.get(`${API_URL}/courses`)
    ])

    students.value = studentResponse.data
    courses.value = courseResponse.data
  } catch (error) {
    formMessage.value =
      error.response?.data?.error ||
      'Could not load students and courses. Check the backend server.'
  }
}

async function enrollStudent() {
  loading.value = true
  formMessage.value = ''

  try {
    const response = await axios.post(`${API_URL}/enrollments`, {
      studentId: selectedStudent.value,
      courseId: selectedCourse.value
    })

    formMessage.value = response.data.message
    rosterCourse.value = selectedCourse.value
    await loadRoster()
  } catch (error) {
    formMessage.value =
      error.response?.data?.error ||
      'Could not enroll the student.'
  } finally {
    loading.value = false
  }
}

async function loadRoster() {
  if (!rosterCourse.value) return

  loading.value = true
  rosterMessage.value = ''
  roster.value = []
  rosterLoaded.value = false

  try {
    const response = await axios.get(
      `${API_URL}/courses/${rosterCourse.value}/roster`
    )

    roster.value = response.data
    rosterLoaded.value = true
  } catch (error) {
    rosterMessage.value =
      error.response?.data?.error ||
      'Could not load the course roster.'
  } finally {
    loading.value = false
  }
}

onMounted(loadOptions)
</script>