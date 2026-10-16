<template>
  <div>
    <h1>Student Management</h1>

    <section>
      <h2>Search for a Student</h2>
      <form @submit.prevent="searchStudent">
        <label for="searchName">Student Name:</label>
        <input id="searchName" v-model.trim="searchQuery" required />
        <button type="submit" :disabled="loading">Search</button>
      </form>

      <p v-if="searchMessage">{{ searchMessage }}</p>

      <div v-if="foundStudent">
        <h3>Search Result</h3>
        <p>Name: {{ foundStudent.name }}</p>
        <p>Student ID: {{ foundStudent.id }}</p>
        <p>Phone: {{ foundStudent.phone }}</p>
        <p>ZIP Code: {{ foundStudent.zip }}</p>
      </div>
    </section>

    <hr />

    <section>
      <h2>Add a Student</h2>
      <form @submit.prevent="addStudent">
        <div>
          <label for="addName">Name:</label>
          <input id="addName" v-model.trim="newStudent.name" required />
        </div>
        <div>
          <label for="addId">Student ID:</label>
          <input id="addId" v-model.trim="newStudent.id" required />
        </div>
        <div>
          <label for="addPhone">Phone:</label>
          <input id="addPhone" v-model.trim="newStudent.phone" type="tel" required />
        </div>
        <div>
          <label for="addZip">ZIP Code:</label>
          <input id="addZip" v-model.trim="newStudent.zip" required />
        </div>
        <button type="submit" :disabled="loading">Add Student</button>
      </form>

      <p v-if="formMessage">{{ formMessage }}</p>
    </section>

    <hr />

    <section>
      <h2>Students List</h2>
      <button @click="loadStudents" :disabled="loading">Refresh List</button>
      <p v-if="listMessage">{{ listMessage }}</p>

      <ul v-if="students.length">
        <li v-for="student in students" :key="student._id">
          {{ student.name }} — ID: {{ student.id }} — Phone: {{ student.phone }} — ZIP: {{ student.zip }}
          <button @click="deleteStudent(student.name)" :disabled="loading">Delete</button>
        </li>
      </ul>
      <p v-else-if="!listMessage">No students are currently saved.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const searchQuery = ref('')
const foundStudent = ref(null)
const searchMessage = ref('')
const formMessage = ref('')
const listMessage = ref('')
const students = ref([])
const loading = ref(false)

const newStudent = reactive({
  name: '',
  id: '',
  phone: '',
  zip: ''
})

async function searchStudent() {
  loading.value = true
  searchMessage.value = ''
  foundStudent.value = null

  try {
    const response = await axios.post(`${API_URL}/find-student`, {
      name: searchQuery.value
    })
    foundStudent.value = response.data
  } catch (error) {
    searchMessage.value =
      error.response?.data?.error || 'Could not connect to the server.'
  } finally {
    loading.value = false
  }
}

async function addStudent() {
  loading.value = true
  formMessage.value = ''

  try {
    const response = await axios.post(`${API_URL}/add-student`, {
      name: newStudent.name,
      id: newStudent.id,
      phone: newStudent.phone,
      zip: newStudent.zip
    })

    formMessage.value = response.data.message
    Object.assign(newStudent, { name: '', id: '', phone: '', zip: '' })
    await loadStudents()
  } catch (error) {
    formMessage.value =
      error.response?.data?.error || 'Could not connect to the server.'
  } finally {
    loading.value = false
  }
}

async function loadStudents() {
  try {
    const response = await axios.get(`${API_URL}/students`)
    students.value = response.data
    listMessage.value = ''
  } catch (error) {
    listMessage.value =
      error.response?.data?.error || 'Could not load students from the server.'
  }
}

async function deleteStudent(name) {
  if (!confirm(`Are you sure you want to delete ${name}?`)) return

  loading.value = true

  try {
    const response = await axios.post(`${API_URL}/delete-student`, { name })
    listMessage.value = response.data.message

    if (foundStudent.value?.name === name) {
      foundStudent.value = null
    }

    await loadStudents()
  } catch (error) {
    listMessage.value =
      error.response?.data?.error || 'Could not connect to the server.'
  } finally {
    loading.value = false
  }
}

onMounted(loadStudents)
</script>