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
          <p class="empty-text">点击下方 + 添加目标</p>
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
          <p class="empty-text">暂无已完成的目标</p>
        </div>
      </div>
    </div>

    <!-- Tab切换 -->
    <div class="tab-bar">
      <button 
        @click="currentTab = 'active'"
        :class="['tab-btn', { active: currentTab === 'active' }]"
      >
        <span class="tab-name">进行中</span>
        <span v-if="goals.length > 0" class="tab-count">{{ goals.length }}</span>
      </button>
      <div class="tab-divider"></div>
      <button 
        @click="currentTab = 'completed'"
        :class="['tab-btn', { active: currentTab === 'completed' }]"
      >
        <span class="tab-name">已完成</span>
        <span v-if="completedGoals.length > 0" class="tab-count">{{ completedGoals.length }}</span>
      </button>
    </div>

    <!-- 添加按钮 -->
    <button 
      @click="showAddModal = true"
      class="add-btn"
    >
      <span class="plus-icon">+</span>
    </button>

    <!-- 添加目标弹窗 -->
    <Transition name="modal">
      <div 
        v-if="showAddModal" 
        class="modal-overlay"
        @click.self="showAddModal = false"
      >
        <div class="modal-content">
          <h3 class="modal-title">添加新目标</h3>
          <input 
            v-model="newGoalTitle"
            @keyup.enter="addGoal"
            type="text" 
            placeholder="输入目标内容..."
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
  padding: 20px 16px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 标题 */
.header {
  padding-bottom: 12px;
  text-align: center;
}

.title {
  font-size: 18px;
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

.goals-wrapper {
  width: 100%;
  max-width: 280px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 目标项 */
.goal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.goal-circle.active {
  border: 2px solid #ffffff;
}

.goal-circle.active .circle-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
}

.goal-circle.completed {
  background: #34c759;
  border-color: #34c759;
}

.check-icon {
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
}

/* 目标文字 */
.goal-text {
  font-size: 14px;
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
  padding: 40px 20px;
}

.empty-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

/* Tab栏 */
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 10px 6px;
  margin-top: 8px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 10px;
}

.tab-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
}

.tab-count {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.2);
}

.tab-btn.active .tab-name {
  color: #ffffff;
  font-weight: 600;
}

.tab-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
}

/* 添加按钮 */
.add-btn {
  position: fixed;
  left: 12px;
  bottom: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.add-btn:active {
  transform: scale(0.95);
}

.plus-icon {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
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
  padding: 20px;
  width: 80%;
  max-width: 260px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 14px;
}

.modal-input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  outline: none;
  margin-bottom: 14px;
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
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
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
  transform: translateY(15px);
}

.goal-leave-to {
  opacity: 0;
  transform: translateX(-20px);
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
