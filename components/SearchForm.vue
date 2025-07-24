<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="grid md:grid-cols-2 gap-x-20 gap-y-8">
      <div
        v-for="(field, index) in fields"
        :key="index"
        :class="[
          'flex items-center gap-4 relative',
          fields.length === 3 && field.key === 'to'
            ? 'justify-self-end md:col-span-2 w-[46.5%]'
            : '',
        ]"
      >
        <label
          :for="field.key"
          class="uppercase text-[#3D3935] w-[170px] text-base font-light"
        >
          {{ field.label }}
        </label>

        <div class="relative w-full">
          <input
            v-model="formData[field.key]"
            :id="field.key"
            :type="field.type"
            ref="inputRefs[field.key]"
            class="w-full h-[50px] flex-1 rounded-[66px] px-6 py-3 text-[#6F6259] uppercase font-light border border-[#C9C7C5] focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] h-[50px] bg-white"
            :placeholder="field.placeholder || ''"
          />

          <!-- Calendar icon for date fields -->
          <template v-if="field.type === 'date'">
            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#8A7C59]"
              @click="focusInput(field.key)"
            >
              <calender/>
            </span>
          </template>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-[#8A7C59] rounded-full uppercase text-white py-3 px-5"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";

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
const inputRefs = {}; // Use plain object

// Initialize formData and refs
onMounted(() => {
  props.fields.forEach((field) => {
    formData[field.key] = field.default || "";
    inputRefs[field.key] = ref(null);
  });
});

const focusInput = (key) => {
  inputRefs[key]?.value?.focus?.();
};

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>

