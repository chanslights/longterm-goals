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
  background: transparent !important;
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
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.goal-item:hover {
  background: rgba(0, 0, 0, 0.8);
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
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  letter-spacing: 0.3px;
  line-height: 1.4;
}

.goal-item.completed .goal-text {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  font-size: 28px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 12px;
  font-weight: 400;
}

/* Tab 栏 */
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 0;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 16px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.tab-divider {
  color: rgba(255, 255, 255, 0.3);
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.modal-content {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  padding: 20px;
  width: 85%;
  max-width: 260px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-input {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 15px;
  outline: none;
  margin-bottom: 14px;
  font-weight: 400;
  color: white;
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.modal-btn.confirm {
  background: rgba(255, 255, 255, 0.9);
  color: black;
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
