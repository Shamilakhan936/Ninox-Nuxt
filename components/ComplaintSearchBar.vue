<template>
  <div class="flex flex-col md:flex-row justify-between gap-4 mb-[90px] flex-wrap">
    <div class="w-full md:w-[40%] lg:w-[325px]">
      <div class="flex items-center w-full rounded-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Complaint Number/Article Number"
          class="w-full md:w-[325px]  px-6 py-3 bg-transparent focus:outline-none text-sm placeholder-[#6F6259] w-full rounded-[66px] border border-[#C9C7C5] bg-white text-[#6F6259] h-[50px] focus:border-[#2d2d2d] focus:border-[1px]"
        />
      </div>
    </div>

    <div class="w-full w-full md:w-[50%]  lg:w-[396px] relative flex">
      <div
        @click="toggleDatePicker"
        class="flex items-center rounded-full border border border-[#C9C7C5] bg-white px-4 py-3 gap-2 text-[#6F6259] w-full text-sm cursor-pointer hover:border-[#B8B0A8] transition-colors h-[50px]"
      >
        <ChevronLeftIcon
          @click.stop="previousMonth"
          class="w-4 h-4 cursor-pointer hover:text-[#4A3F35] flex-shrink-0"
        />
        <span class="flex-1 text-center truncate">{{ formattedRange }}</span>
        <ChevronRightIcon
          @click.stop="nextMonth"
          class="w-4 h-4 cursor-pointer hover:text-[#4A3F35] flex-shrink-0"
        />
      </div>

      <div
        v-if="showDatePicker"
        class="absolute top-full mt-2 bg-white border border border-[#C9C7C5] rounded-lg shadow-lg z-50 p-4 min-w-[300px] w-full max-w-[350px] left-0 right-0 mx-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
            <ChevronLeftIcon class="w-4 h-4" />
          </button>
          <h3 class="text-sm font-medium">{{ currentMonthYear }}</h3>
          <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-4">
          <div
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="day"
            class="text-xs text-center text-gray-500 py-1"
          >
            {{ day }}
          </div>
          <div
            v-for="date in calendarDates"
            :key="date.toISOString()"
            @click="selectDate(date)"
            :class="[
              'text-xs text-center py-2 cursor-pointer rounded hover:bg-gray-100',
              {
                'text-gray-400': !isSameMonth(date, currentDate),
                'bg-blue-500 text-white': isSelectedDate(date),
                'bg-blue-100': isInRange(date),
                'font-medium': isToday(date),
              },
            ]"
          >
            {{ date.getDate() }}
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 gap-2"
        >
          <div>
            <span class="font-medium">Start:</span>
            {{ format(startDate, "dd MMM yyyy") }}
          </div>
          <div>
            <span class="font-medium">End:</span>
            {{ format(endDate, "dd MMM yyyy") }}
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="applyDateRange"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
          <button
            @click="closeDatePicker"
            class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
        <FilterIcon
          class="ml-6 self-center cursor-pointer"
          :size="12"
        />
    </div>
      
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isWithinInterval,
} from "date-fns";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import FilterIcon from "@/assets/icons/FilterIcon";


// Reactive state
const searchQuery = ref("");
const startDate = ref(new Date(2024, 4, 28));
const endDate = ref(new Date(2025, 4, 28));
const showDatePicker = ref(false);
const currentDate = ref(new Date());
const selectionMode = ref("start"); // 'start' or 'end'

// Computed properties
const formattedRange = computed(
  () =>
    `${format(startDate.value, "dd MMM yyyy")} – ${format(
      endDate.value,
      "dd MMM yyyy"
    )}`
);

const currentMonthYear = computed(() => format(currentDate.value, "MMMM yyyy"));

const calendarDates = computed(() => {
  const start = startOfMonth(currentDate.value);
  const end = endOfMonth(currentDate.value);

  const firstDayOfWeek = start.getDay();
  const adjustedStart = new Date(start);
  adjustedStart.setDate(adjustedStart.getDate() - firstDayOfWeek);

  const lastDayOfWeek = end.getDay();
  const adjustedEnd = new Date(end);
  adjustedEnd.setDate(adjustedEnd.getDate() + (6 - lastDayOfWeek));

  return eachDayOfInterval({ start: adjustedStart, end: adjustedEnd });
});

// Methods
const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};

const closeDatePicker = () => {
  showDatePicker.value = false;
};

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

const selectDate = (date) => {
  if (selectionMode.value === "start") {
    startDate.value = date;
    selectionMode.value = "end";
  } else {
    endDate.value = date;
    selectionMode.value = "start";
  }
};

const isSelectedDate = (date) => {
  return (
    format(date, "yyyy-MM-dd") === format(startDate.value, "yyyy-MM-dd") ||
    format(date, "yyyy-MM-dd") === format(endDate.value, "yyyy-MM-dd")
  );
};

const isInRange = (date) => {
  if (!startDate.value || !endDate.value) return false;
  return isWithinInterval(date, { start: startDate.value, end: endDate.value });
};

const applyDateRange = () => {
  if (startDate.value > endDate.value) {
    const temp = startDate.value;
    startDate.value = endDate.value;
    endDate.value = temp;
  }
  closeDatePicker();
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    closeDatePicker();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
.text-sm {
  font-size: 16px !important;
  line-height: 26px !important;
  }
</style>
