<template>
  <div :class="['todo-item', todo.completed ? 'completed' : '']">
    <input 
      type="checkbox"
      class="toggle"
      v-model="todo.completed"
    >
    <label>{{todo.content}}</label>
    <button class="destroy" @click="deleteTodo"></button>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    }
  },
  methods: {
    deleteTodo() {
      this.$emit('del', this.todo.id) // 通过触发事件完成父子组件通信
    }
  }
}
</script>

<style lang="stylus" scoped>
.todo-item {
  position relative
  background-color #fff
  font-size 24px
  border-bottom 1px solid rgba(0,0,0,0.06)
  &:hover {
    .destroy:after{
      content: '×'
    }
  }
  label {
    white-space pre-line // 合并空白符序列，但是保留换行符
    word-break break-all // 允许在单词内换行
    padding 15px 60px 15px 15px
    margin-left 45px
    display block
    line-height 1.2
    transition color 0.4s
  }
  &.completed {
    label {
      color #d9d9d9
      text-decoration line-through
    }
  }
}
.toggle {
  text-align center
  width 40px
  height 40px
  position absolute
  top 4
  bottom 0 
  margin-left 3
  border none 
  appearance none 
  outline none
  &:after {
    content url('../assets/images/chuangzuo.svg')
  }
  &:checked:after {
    content url('../assets/images/chenggong.svg')
  }
}
.destroy {
  position absolute
  top 0
  right 10px
  bottom 0
  width 40px
  height 40px
  margin auto 0
  font-size 30px
  color #cc9a9a
  margin-bottom 11px
  transition color 0.2s ease-out
  background-color transparent
  appearance none
  border-width 0
  cursor pointer
  outline none
}
</style>