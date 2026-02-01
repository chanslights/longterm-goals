import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGoalStore = defineStore('goals', () => {
  const goals = ref([])

  // 从本地存储加载
  const loadGoals = () => {
    const saved = localStorage.getItem('longterm-goals')
    if (saved) {
      goals.value = JSON.parse(saved)
    }
  }

  // 保存到本地存储
  const saveGoals = () => {
    localStorage.setItem('longterm-goals', JSON.stringify(goals.value))
  }

  // 添加目标
  const addGoal = (title) => {
    const goal = {
      id: Date.now(),
      title,
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null
    }
    goals.value.unshift(goal)
    saveGoals()
  }

  // 完成目标
  const completeGoal = (id) => {
    const goal = goals.value.find(g => g.id === id)
    if (goal) {
      goal.completed = true
      goal.completedAt = new Date().toISOString()
      saveGoals()
    }
  }

  // 删除目标
  const deleteGoal = (id) => {
    goals.value = goals.value.filter(g => g.id !== id)
    saveGoals()
  }

  // 恢复目标
  const restoreGoal = (id) => {
    const goal = goals.value.find(g => g.id === id)
    if (goal) {
      goal.completed = false
      goal.completedAt = null
      saveGoals()
    }
  }

  // 计算属性
  const activeGoals = computed(() => goals.value.filter(g => !g.completed))
  const completedGoals = computed(() => goals.value.filter(g => g.completed))

  return {
    goals,
    activeGoals,
    completedGoals,
    loadGoals,
    addGoal,
    completeGoal,
    deleteGoal,
    restoreGoal
  }
})
