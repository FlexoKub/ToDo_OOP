'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, todoСontainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        //коллекция дел
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
        //общий контейнер
        this.todoСontainer = document.querySelector(todoСontainer);
    }
    //добавление в locatStorege
    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.input.value = '';
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }
    //создание елемента
    createItem (todo) {
        
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove" data-id=${todo.key}></button>
					<button class="todo-complete" data-id=${todo.key}></button>
				</div>
        `);
        if(todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }


    addTodo(e) {
        e.preventDefault();
        //новое дело
        if(this.input.value.trim()){
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            //добавляем в коллекцию с ключом
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Пустое дело добавить нельзя!');
            return;
        }
        
    }

    generateKey() {
        //набор символов
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    }
    //удоление
    deleteItem(i) {
        this.todoData.forEach((item) => {
            if(item.key === i.dataset.id) {
                // console.log(item.key);
                this.todoData.delete(item.key);
                // this.todoData.splice(i.dataset.id);
                this.render();
            }
        } );
    }
    //изменение статуса
    completedItem(i){
        this.todoData.forEach((item) => {
            if(item.key === i.dataset.id) {
                item.completed = !item.completed;
                this.render();
            }
        } );
    }
    //клик по статусу или корзине
    handler() {
        this.todoСontainer.addEventListener('click', (event) => {
            let target = event.target;
            if(target.classList.contains('todo-remove')){
                this.deleteItem(target);

            } else if (target.classList.contains('todo-complete')) {
                this.completedItem(target);
            }
        });
        
    }
    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        
        this.handler();
        this.render();
    }
}
const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
