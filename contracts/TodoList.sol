pragma solidity ^0.8.0;

contract TodoList {
    event Created(uint id, string content);
    event UpdateIsCompleted(uint id, bool completed);

    struct Task {
        string content;
        bool isCompleted;
    }

    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    constructor() {
        createTask("Initial Data");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(_content, false);
        emit Created(taskCount, _content);
    }

    function toggleIsCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.isCompleted = !_task.isCompleted;
        tasks[_id] = _task;
        emit UpdateIsCompleted(_id, _task.isCompleted);
    }
}