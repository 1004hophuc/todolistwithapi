import React, { Component } from 'react';
import Axios from 'axios';
import './ToDoListWithAPI.css';

export default class ToDoListWithAPIClass extends Component {

    state = {
        taskList: [],
        values: {
            taskName: ''
        },
        errors: {
            taskName: ''
        }
    }

    getTaskList = () => {
        let promise = Axios({
            url: 'http://svcy.myclass.vn/api/ToDoList/GetAllTask',
            method: 'GET'
        })
        promise.then((result) => {
            console.log(result.data);

            this.setState({
                taskList: result.data
            });
            console.log('Thành công!')
        })
        promise.catch((error) => {
            console.log(error.response.data)
        })
    }

    renderTaskToDo = () => {
        return this.state.taskList.filter(ta => !ta.status).map((item, index) => {
            console.log(item)
            return <li key={index}>
                <span>{item.taskName}</span>
                <div className="buttons">
                    <button onClick={() => { this.deleteTask(item.taskName) }} type="button" className="remove">
                        <i className="fa fa-trash-alt" />
                    </button>
                    <button onClick={() => { this.doneTask(item.taskName) }} type="button" className="complete">
                        <i className="far fa-check-circle" />
                        <i className="fas fa-check-circle" />
                    </button>
                </div>
            </li>
        })
    }

    renderTaskCompleted = () => {
        return this.state.taskList.filter(ta => ta.status).map((item, index) => {
            return <li key={index}>
                <span>{item.taskName}</span>
                <div className="buttons">
                    <button onClick={() => { this.deleteTask(item.taskName) }} type="button" className="remove">
                        <i className="fa fa-trash-alt" />
                    </button>
                    <button onClick={() => {
                        this.rejectTask(item.taskName)
                    }} type="button" className="complete">
                        <i className="fas fa-undo" />
                    </button>
                    <button type="button" className="complete">
                        <i className="fas fa-check-circle" />
                    </button>
                </div>
            </li>
        })
    }
    //Hàm sẽ tự động thực thi sau khi nội dung component được render
    componentDidMount() {
        this.getTaskList();
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        console.log(name, value)

        let newValues = { ...this.state.values, [name]: value };
        let newErrors = { ...this.state.errors };

        const regexString = /^[A-Z a-z]+$/;
        if (!regexString.test(value) || value.trim() === '') {
            newErrors[name] = name + ' is invalid!'
        } else {
            newErrors[name] = '';
        }

        this.setState({
            ...this.state,
            values: newValues,
            errors: newErrors
        })
    }

    addTask = (e) => {
        e.preventDefault();

        let promise = Axios({
            url: 'http://svcy.myclass.vn/api/ToDoList/AddTask',
            method: 'POST',
            data: {
                taskName: this.state.values.taskName
            }
        })

        promise.then((result) => {
            console.log(result.data)
            this.getTaskList();
        })
        promise.catch((error) => {
            console.log(error.response.data)
        })
    }

    deleteTask = (taskName) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/deleteTask?taskName=${taskName}`,
            method: 'DELETE'
        })

        promise.then(result => {
            console.log(result.data);
            this.getTaskList();
        });
        promise.catch(error => {
            console.log(error.response.data)
        })
    }

    doneTask = (taskName) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/doneTask?taskName=${taskName}`,
            method: 'PUT'
        })

        promise.then(result => {
            console.log(result.data);
            this.getTaskList();
        });
        promise.catch(error => {
            console.log(error.response.data)
        })
    }

    rejectTask = (taskName) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/rejectTask?taskName=${taskName}`,
            method: 'PUT'
        })

        promise.then(result => {
            console.log(result.data);
            this.getTaskList();
        });
        promise.catch(error => {
            console.log(error.response.data)
        })
    }

    render() {
        return (
            <form onSubmit={this.addTask}>
                {/* <button onClick={() => { this.getTaskList() }}>Get task list</button> */}
                <div className="card">
                    <div className="card__header">
                        <img alt="img" src={require('./img/bg.png')} />
                    </div>
                    {/* <h2>hello!</h2> */}
                    <div className="card__body">
                        <div className="card__content">
                            <div className="form-group">
                                <div className="card__title">
                                    <h2>My Tasks</h2>
                                    <p>September 9,2020</p>
                                </div>
                                <div className="card__add">
                                    <input name="taskName" onChange={this.handleChange} id="newTask" type="text" placeholder="Enter an activity..." />

                                    <button id="addItem" onClick={this.addTask}>
                                        <i className="fa fa-plus" />
                                    </button>
                                </div>
                                <span className="text text-danger">{this.state.errors.taskName}</span>
                            </div>

                            <div className="card__todo form-group">
                                {/* Uncompleted tasks */}
                                <ul className="todo" id="todo">
                                    {this.renderTaskToDo()}
                                </ul>
                                {/* Completed tasks */}
                                <ul className="todo" id="completed">
                                    {this.renderTaskCompleted()}

                                    {/* <li>
                                    <span>Ăn sáng</span>
                                    <div className="buttons">
                                        <button className="remove">
                                            <i className="fa fa-trash-alt" />
                                        </button>
                                        <button className="complete">
                                            <i className="far fa-check-circle" />
                                            <i className="fas fa-check-circle" />
                                        </button>
                                    </div>
                                </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}