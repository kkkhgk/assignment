// 待办事项列表类
class TodoList {
    constructor() {
      this.todos = [];
    }
  
    add(todo) {
      this.todos.push(todo);
    }
  
    markCompleted(index) {
      this.todos[index].completed = true;
    }
  
    markUncompleted(index) {
      this.todos[index].completed = false;
    }
  
    remove(index) {
      this.todos.splice(index, 1);
    }
  
    clearAll() {
      this.todos = [];
    }
  
    getAll() {
      return this.todos;
    }
  
    getCompleted() {
      return this.todos.filter(todo => todo.completed);
    }
  
    getUncompleted() {
      return this.todos.filter(todo => !todo.completed);
    }
  }
  
  export default TodoList;