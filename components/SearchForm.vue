<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="grid md:grid-cols-2 gap-x-[10vw] gap-y-8">
      <div
        v-for="(field, index) in fields"
        :key="index"
        :class="[
          'flex items-center gap-4',
          fields.length === 3 && field.key === 'to'
            ? 'col-start-2'
            : '',
        ]"
      >
        <label
          :for="field.key"
          class="uppercase text-[#3D3935] w-[120px] text-base font-light"
        >
          {{ field.label }}
        </label>
        <input
          v-model="formData[field.key]"
          :id="field.key"
          :type="field.type"
          class="flex-1 rounded-[66px] px-6 py-3 text-[#6F6259] font-light border border-[#C9C7C5] focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] h-[50px] bg-white"
          :placeholder="field.placeholder || ''"
        />
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-[#8A7C59] rounded-full text-white py-3 px-5"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  buttonLabel: {
    type: String,
    default: "Search",
  },
});

const emit = defineEmits(["submit"]);

const formData = reactive({});

// Initialize form fields
props.fields.forEach((field) => {
  formData[field.key] = field.default || "";
});

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>
