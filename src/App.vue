<template>
  <div class="app-container">
    <!-- 目标列表 -->
    <div class="goals-container">
      <div class="goals-wrapper">
        <!-- 进行中列表 -->
        <div v-if="currentTab === 'active'" class="goals-list">
          <TransitionGroup name="goal">
            <div 
              v-for="goal in goals" 
              :key="goal.id"
              class="goal-item"
              @click="completeGoal(goal.id)"
            >
              <div class="goal-circle">
                <span v-if="goal.completed" class="check-icon">✓</span>
              </div>
              <span class="goal-text">{{ goal.title }}</span>
            </div>
          </TransitionGroup>
          
          <div v-if="goals.length === 0" class="empty-state">
            <span class="empty-icon">◎</span>
            <p>点击 + 添加目标</p>
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
            <span class="empty-icon">✓</span>
            <p>暂无已完成的目标</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <button 
        @click="currentTab = 'active'"
        :class="['tab-btn', { active: currentTab === 'active' }]"
      >
        进行中
      </button>
      <span class="tab-divider">|</span>
      <button 
        @click="currentTab = 'completed'"
        :class="['tab-btn', { active: currentTab === 'completed' }]"
      >
        已完成
      </button>
    </div>

    <!-- 添加按钮 -->
    <button 
      @click="showAddModal = true"
      class="add-btn"
    >
      +
    </button>

    <!-- 添加目标弹窗 -->
    <Transition name="modal">
      <div 
        v-if="showAddModal" 
        class="modal-overlay"
        @click.self="showAddModal = false"
      >
        <div class="modal-content">
          <input 
            v-model="newGoalTitle"
            @keyup.enter="addGoal"
            type="text" 
            placeholder="输入目标..."
            class="modal-input"
            autofocus
          />
          <div class="modal-actions">
            <button @click="showAddModal = false; newGoalTitle = ''" class="modal-btn cancel">
              取消
            </button>
            <button @click="addGoal" :disabled="!newGoalTitle.trim()" class="modal-btn confirm">
              添加
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

const deleteGoal = (id) => {
  store.deleteGoal(id)
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
  justify-content: space-between;
  padding: 20px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 目标列表 */
.goals-container {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.goals-wrapper {
  width: 100%;
  max-width: 280px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.goal-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.02);
}

.goal-item:active {
  transform: scale(0.98);
}

.goal-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.goal-circle.completed {
  background: #000;
  border-color: #000;
}

.check-icon {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.goal-text {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 400;
  letter-spacing: 0.3px;
  line-height: 1.4;
}

.goal-item.completed .goal-text {
  color: #86868b;
  text-decoration: line-through;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #86868b;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 13px;
  font-weight: 400;
}

/* Tab 栏 */
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 0;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #86868b;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active {
  color: #1d1d1f;
  background: rgba(0, 0, 0, 0.05);
}

.tab-divider {
  color: #d2d2d7;
  font-size: 10px;
}

/* 添加按钮 */
.add-btn {
  position: fixed;
  left: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  color: white;
  font-size: 22px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-app-region: no-drag;
}

.add-btn:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.9);
}

.add-btn:active {
  transform: scale(0.95);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 24px;
  width: 90%;
  max-width: 280px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-input {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 16px;
  outline: none;
  margin-bottom: 16px;
  font-weight: 400;
}

.modal-input::placeholder {
  color: #86868b;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.modal-btn.confirm {
  background: #007aff;
  color: white;
}

.modal-btn.confirm:disabled {
  opacity: 0.4;
}

/* 动画 */
.goal-enter-active,
.goal-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.goal-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.modal-enter-active {
  transition: all 0.3s ease;
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
  transform: scale(0.9);
}
</style>
