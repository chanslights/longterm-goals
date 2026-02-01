<template>
  <div class="min-h-screen bg-ios-gray">
    <!-- 顶部标题 -->
    <div class="bg-white px-4 py-3 shadow-sm">
      <h1 class="text-xl font-semibold text-center text-gray-900">长期目标</h1>
    </div>

    <!-- Tab 切换 -->
    <div class="bg-white mt-2 px-4 py-2 flex justify-around border-b border-gray-100">
      <button 
        @click="currentTab = 'active'"
        :class="['px-4 py-2 text-sm font-medium transition-colors', 
                 currentTab === 'active' ? 'text-ios-blue' : 'text-gray-400']"
      >
        进行中
      </button>
      <button 
        @click="currentTab = 'completed'"
        :class="['px-4 py-2 text-sm font-medium transition-colors', 
                 currentTab === 'completed' ? 'text-ios-blue' : 'text-gray-400']"
      >
        已完成
      </button>
    </div>

    <!-- 目标列表 -->
    <div class="px-4 py-2">
      <!-- 进行中列表 -->
      <div v-if="currentTab === 'active'">
        <div 
          v-for="goal in goals" 
          :key="goal.id"
          class="bg-white rounded-xl mb-2 p-4 shadow-sm flex items-center justify-between"
        >
          <div class="flex items-center flex-1">
            <button 
              @click="completeGoal(goal.id)"
              class="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center hover:border-ios-green transition-colors"
            >
              <span v-if="goal.completed" class="text-ios-green">✓</span>
            </button>
            <div>
              <p class="text-gray-900 text-base">{{ goal.title }}</p>
              <p class="text-gray-400 text-xs mt-1">{{ formatDate(goal.createdAt) }}</p>
            </div>
          </div>
          <button 
            @click="deleteGoal(goal.id)"
            class="text-ios-red text-sm px-3 py-1"
          >
            删除
          </button>
        </div>
        
        <div v-if="goals.length === 0" class="text-center py-12">
          <p class="text-gray-400 text-sm">暂无目标，点击下方添加</p>
        </div>
      </div>

      <!-- 已完成列表 -->
      <div v-else>
        <div 
          v-for="goal in completedGoals" 
          :key="goal.id"
          class="bg-white rounded-xl mb-2 p-4 shadow-sm flex items-center justify-between"
        >
          <div class="flex items-center flex-1">
            <div class="w-6 h-6 rounded-full bg-ios-green mr-3 flex items-center justify-center">
              <span class="text-white text-xs">✓</span>
            </div>
            <div>
              <p class="text-gray-900 text-base line-through text-gray-400">{{ goal.title }}</p>
              <p class="text-gray-400 text-xs mt-1">
                完成于 {{ formatDate(goal.completedAt) }}
              </p>
            </div>
          </div>
          <button 
            @click="restoreGoal(goal.id)"
            class="text-ios-blue text-sm px-3 py-1"
          >
            恢复
          </button>
        </div>

        <div v-if="completedGoals.length === 0" class="text-center py-12">
          <p class="text-gray-400 text-sm">暂无已完成的目标</p>
        </div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <div class="fixed bottom-8 left-0 right-0 px-4">
      <button 
        @click="showAddModal = true"
        class="w-full bg-ios-blue text-white py-4 rounded-2xl font-medium text-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        + 添加新目标
      </button>
    </div>

    <!-- 添加目标弹窗 -->
    <Teleport to="body">
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black/50 flex items-end justify-center"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-t-3xl w-full p-6 animate-slide-up">
          <h2 class="text-lg font-semibold mb-4">添加新目标</h2>
          <input 
            v-model="newGoalTitle"
            @keyup.enter="addGoal"
            type="text" 
            placeholder="输入你的长期目标..."
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-ios-blue mb-4"
            autofocus
          />
          <div class="flex gap-3">
            <button 
              @click="showAddModal = false; newGoalTitle = ''"
              class="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium"
            >
              取消
            </button>
            <button 
              @click="addGoal"
              :disabled="!newGoalTitle.trim()"
              class="flex-1 py-3 rounded-xl bg-ios-blue text-white font-medium disabled:opacity-50"
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGoalStore } from './stores/goalStore'

const store = useGoalStore()
const currentTab = ref('active')
const showAddModal = ref(false)
const newGoalTitle = ref('')

onMounted(() => {
  store.loadGoals()
})

const goals = computed(() => store.activeGoals)
const completedGoals = computed(() => store.completedGoals)

const addGoal = () => {
  if (newGoalTitle.value.trim()) {
    store.addGoal(newGoalTitle.value.trim())
    newGoalTitle.value = ''
    showAddModal.value = false
  }
}

const completeGoal = (id) => {
  store.completeGoal(id)
}

const deleteGoal = (id) => {
  store.deleteGoal(id)
}

const restoreGoal = (id) => {
  store.restoreGoal(id)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
