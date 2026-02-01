<template>
  <div class="app-container">
    <!-- 标题区域 -->
    <div class="header">
      <h1 class="title">长期目标</h1>
    </div>

    <!-- 目标列表 -->
    <div class="goals-container">
      <!-- 进行中列表 -->
      <div v-if="currentTab === 'active'" class="goals-list">
        <TransitionGroup name="goal">
          <div 
            v-for="goal in goals" 
            :key="goal.id"
            class="goal-item"
            @click="completeGoal(goal.id)"
          >
            <div class="goal-circle active">
              <span class="circle-dot"></span>
            </div>
            <span class="goal-text">{{ goal.title }}</span>
          </div>
        </TransitionGroup>
        
        <div v-if="goals.length === 0" class="empty-state">
          <p class="empty-text">Tap + to add goal</p>
        </div>
      </div>

      <!-- 已完成列表 -->
      <div v-else class="goals-list">
        <TransitionGroup name="goal">
          <div 
            v-for="goal in completedGoals" 
            :key="goal.id"
            class="goal-item completed"
            @click="restoreGoal(goal.id)"
          >
            <div class="goal-circle completed">
              <span class="check-icon">✓</span>
            </div>
            <span class="goal-text">{{ goal.title }}</span>
          </div>
        </TransitionGroup>

        <div v-if="completedGoals.length === 0" class="empty-state">
          <p class="empty-text">No completed goals</p>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="bottom-bar">
      <!-- Tab切换 -->
      <div class="tab-group">
        <button 
          @click="currentTab = 'active'"
          :class="['tab-btn', { active: currentTab === 'active' }]"
        >
          <span class="tab-indicator-dot"></span>
          <span class="tab-name">Active</span>
          <span v-if="goals.length > 0" class="tab-count">{{ goals.length }}</span>
        </button>
        <button 
          @click="currentTab = 'completed'"
          :class="['tab-btn', { active: currentTab === 'completed' }]"
        >
          <span class="tab-indicator-dot"></span>
          <span class="tab-name">Done</span>
          <span v-if="completedGoals.length > 0" class="tab-count">{{ completedGoals.length }}</span>
        </button>
      </div>

      <!-- 添加按钮 -->
      <button 
        @click="showAddModal = true"
        class="add-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>

    <!-- 添加目标弹窗 -->
    <Transition name="modal">
      <div 
        v-if="showAddModal" 
        class="modal-overlay"
        @click.self="showAddModal = false"
      >
        <div class="modal-content">
          <h3 class="modal-title">New Goal</h3>
          <input 
            v-model="newGoalTitle"
            @keyup.enter="addGoal"
            type="text" 
            placeholder="Enter your goal..."
            class="modal-input"
            autofocus
          />
          <div class="modal-actions">
            <button @click="showAddModal = false; newGoalTitle = ''" class="modal-btn cancel">
              Cancel
            </button>
            <button @click="addGoal" :disabled="!newGoalTitle.trim()" class="modal-btn confirm">
              Add
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

const restoreGoal = (id) => {
  store.restoreGoal(id)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px 14px 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 标题 */
.header {
  padding-bottom: 10px;
  text-align: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
}

/* 目标容器 */
.goals-container {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.goals-list {
  width: 100%;
  max-width: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}

/* 自定义滚动条 */
.goals-list::-webkit-scrollbar {
  width: 4px;
}

.goals-list::-webkit-scrollbar-track {
  background: transparent;
}

.goals-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.goals-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 目标项 */
.goal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.15);
}

.goal-item:hover {
  background: rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.4);
}

.goal-item:active {
  transform: scale(0.98);
}

.goal-item.completed {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.goal-item.completed:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 圆形选择器 */
.goal-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.goal-circle.active .circle-dot {
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
}

.goal-circle.completed {
  background: #34c759;
  border-color: #34c759;
}

.check-icon {
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
}

/* 目标文字 */
.goal-text {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.4;
}

.goal-item.completed .goal-text {
  color: rgba(255, 255, 255, 0.45);
  text-decoration: line-through;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

.empty-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* 底部控制栏 */
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
}

/* Tab组 */
.tab-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.tab-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.tab-name {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.tab-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.15);
}

.tab-btn.active .tab-indicator-dot {
  background: #34c759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.5);
}

.tab-btn.active .tab-name {
  color: #ffffff;
  font-weight: 600;
}

/* 添加按钮 */
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.add-btn:active {
  transform: scale(0.95);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 16px;
  padding: 18px;
  width: 78%;
  max-width: 240px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.modal-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}

.modal-input {
  width: 100%;
  padding: 11px 13px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 13px;
  outline: none;
  margin-bottom: 12px;
  color: #ffffff;
  border: 1px solid transparent;
}

.modal-input:focus {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.modal-btn {
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.modal-btn.confirm {
  background: #ffffff;
  color: #000000;
}

.modal-btn.confirm:disabled {
  opacity: 0.4;
}

/* 动画 */
.goal-enter-active,
.goal-leave-active {
  transition: all 0.3s ease;
}

.goal-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.goal-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

.modal-enter-active {
  transition: all 0.25s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
