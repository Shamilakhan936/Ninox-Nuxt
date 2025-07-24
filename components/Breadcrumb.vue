<template>
  <nav>
    <ul class="flex space-x-2 items-center">
     <li
        v-for="(crumb, index) in items"
        :key="index"
        class="flex items-center text-sm uppercase"
      >
        <router-link
          v-if="crumb.to"
          :to="crumb.to"
          class="text-black font-light hover:underline transition"
        >
          {{ crumb.label }}
        </router-link>
        <span
          v-else
          class="text-[#8A7C59] font-medium"
        >
          {{ crumb.label }}
        </span>

        <NextArrow
          v-if="index < items.length - 1"
          class="ml-1 self-center flex-shrink-0"
          :size="12"
        />
</li>

    </ul>
  </nav>
</template>

<script>
import NextArrow from "@/assets/icons/NextArrow.vue";

export default {
  name: "Breadcrumb",
  props: {
    items: {
      type: Array, // Array of { label: string, to?: string }
      required: true,
    },
  },
  components: {
    NextArrow,
  },
};
</script>


<style scoped>
.text-sm {
  font-size: 12px !important;
  line-height: 1.2 !important;
  font-weight: 300 !important;
  font-family: "Albert Sans", sans-serif !important;
  letter-spacing: 0.1em !important;
}
</style>
