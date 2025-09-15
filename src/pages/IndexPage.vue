<template>
  <q-page padding class="flex flex-center" style="background-color: #f5f5f5">
    <q-card class="full-width" bordered>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-input dense outlined v-model="name" class="full-width" />
          </div>

          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-icon name="fa-duotone fa-solid fa-house" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
const name = ref("");
</script>