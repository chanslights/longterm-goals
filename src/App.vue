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
                <div v-if="!goal.completed" class="circle-ring"></div>
                <span v-else class="check-icon">✓</span>
              </div>
              <span class="goal-text">{{ goal.title }}</span>
            </div>
          </TransitionGroup>
          
          <div v-if="goals.length === 0" class="empty-state">
            <div class="empty-icon-container">
              <span class="empty-icon">◎</span>
            </div>
            <p class="empty-text">点击 + 添加目标</p>
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
            <div class="empty-icon-container completed">
              <span class="empty-icon">✓</span>
            </div>
            <p class="empty-text">暂无已完成的目标</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 - 带有明显的下划线指示器 -->
    <div class="tab-container">
      <div class="tab-wrapper">
        <button 
          @click="currentTab = 'active'"
          :class="['tab-btn', { active: currentTab === 'active' }]"
        >
          <span class="tab-icon">◉</span>
          <span class="tab-label">进行中</span>
          <span v-if="goals.length > 0" class="tab-badge">{{ goals.length }}</span>
        </button>
        <button 
          @click="currentTab = 'completed'"
          :class="['tab-btn', { active: currentTab === 'completed' }]"
        >
          <span class="tab-icon">◎</span>
          <span class="tab-label">已完成</span>
          <span v-if="completedGoals.length > 0" class="tab-badge completed">{{ completedGoals.length }}</span>
        </button>
        <!-- 动态下划线指示器 -->
        <div 
          class="tab-indicator"
          :style="{ left: currentTab === 'active' ? '8px' : 'calc(50% + 4px)' }"
        ></div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button 
      @click="showAddModal = true"
      class="add-btn"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <!-- 添加目标弹窗 -->
    <Transition name="modal">
      <div 
        v-if="showAddModal" 
        class="modal-overlay"
        @click.self="showAddModal = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-icon">◎</span>
            <h3 class="modal-title">新目标</h3>
          </div>
          <input 
            v-model="newGoalTitle"
            @keyup.enter="addGoal"
            type="text" 
            placeholder="输入你的目标..."
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
  padding: 16px 14px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  background: transparent !important;
}

/* 目标列表区域 */
.goals-container {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding-top: 4px;
}

.goals-wrapper {
  width: 100%;
  max-width: 260px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 目标项样式 */
.goal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.goal-item:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: scale(1.01);
}

.goal-item:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.22);
}

.goal-item.completed {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.04);
}

/* 圆形选择器 */
.goal-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.8px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
  position: relative;
}

.goal-circle.completed {
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.4);
}

.circle-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.8px solid rgba(255, 255, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.3; }
}

.check-icon {
  color: white;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

/* 目标文字 */
.goal-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 500;
  letter-spacing: 0.2px;
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
  padding: 60px 20px;
}

.empty-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.empty-icon-container.completed {
  background: rgba(52, 199, 89, 0.12);
}

.empty-icon {
  font-size: 24px;
  opacity: 0.6;
}

.empty-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 400;
}

/* Tab容器 */
.tab-container {
  padding: 0 4px;
  margin-bottom: 8px;
}

.tab-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.tab-icon {
  font-size: 13px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.tab-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.tab-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.tab-badge.completed {
  background: rgba(52, 199, 89, 0.25);
  color: #34c759;
}

.tab-btn.active .tab-icon {
  opacity: 1;
}

.tab-btn.active .tab-label {
  color: white;
  font-weight: 600;
}

/* 动态下划线指示器 */
.tab-indicator {
  position: absolute;
  top: 4px;
  width: calc(50% - 8px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 添加按钮 */
.add-btn {
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-app-region: no-drag;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.08);
  color: white;
}

.add-btn:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.25);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}

.modal-content {
  background: rgba(30, 30, 30, 0.85);
  border-radius: 20px;
  padding: 20px;
  width: 82%;
  max-width: 240px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.modal-icon {
  font-size: 18px;
  opacity: 0.7;
}

.modal-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.modal-input {
  width: 100%;
  padding: 13px 14px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 14px;
  outline: none;
  margin-bottom: 12px;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.modal-input:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
}

.modal-btn.cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}

.modal-btn.confirm {
  background: white;
  color: black;
}

.modal-btn.confirm:hover {
  background: rgba(255, 255, 255, 0.92);
}

.modal-btn.confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 动画 */
.goal-enter-active,
.goal-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.goal-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.goal-move {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.92) translateY(10px);
}
</style>
