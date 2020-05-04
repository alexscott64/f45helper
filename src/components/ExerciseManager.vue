<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Exercise Manager</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exercise in exercises" :key="exercise.id">
              <td>{{ exercise.id }}</td>
              <td>{{ exercise.exercise_name }}</td>
              <td>{{ exercise.exercise_description }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateExerciseToEdit(exercise)">Edit</a> -
                <a href="#" @click.prevent="deleteExercise(exercise.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Exercise ID#' + model.id : 'New Exercise')">
          <form @submit.prevent="saveExercise">
            <b-form-group label="Title">
              <b-form-input type="text" v-model="model.title"></b-form-input>
            </b-form-group>
            <b-form-group label="Body">
              <b-form-textarea rows="4" v-model="model.body"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Exercise</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      exercises: [],
      model: {}
    }
  },
  async created () {
    this.refreshExercises()
  },
  methods: {
    async refreshExercises () {
      this.loading = true
      this.exercises = await api.getExercises()
      this.loading = false
    },
    async populateExerciseToEdit (exercise) {
      this.model = Object.assign({}, exercise)
    },
    async saveExercise () {
      if (this.model.id) {
        await api.updateExercise(this.model.id, this.model)
      } else {
        await api.createExercise(this.model)
      }
      this.model = {} // reset form
      await this.refreshExercises()
    },
    async deleteExercise (id) {
      if (confirm('Are you sure you want to delete this exercise?')) {
        // if we are editing a exercise we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteExercise(id)
        await this.refreshExercises()
      }
    }
  }
}
</script>