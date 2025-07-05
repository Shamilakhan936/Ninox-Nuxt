<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="grid md:grid-cols-2 gap-x-20 gap-y-8">
      <div
        v-for="(field, index) in fields"
        :key="index"
        :class="[
          'flex items-center gap-4',
          fields.length === 3 && field.key === 'to'
            ? 'justify-self-end md:col-span-2 w-[46.5%]'
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
          class="flex-1 rounded-[66px] px-4 py-2 text-[var(--Ash-Grey, #6F6259)] font-light border border-[var(--Line-Strong, #C9C7C5)] focus:outline-none h-[50px]"
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
