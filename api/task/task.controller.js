const taskService = require('./task.service')
const externalService = require('./external.service')



async function performTask(req, res) {
    const task = req.body
    if (task.doneAt) return
    try {
        await externalService.execute(task)
        task.doneAt = Date.now()
    } catch (error) {
        task.triesCount += 1;
        console.log(`Task Controller - ERROR: Cannot perform task.`);
        throw error;
    } finally {
        task.lastTriedAt = Date.now()
        taskService.update(task)
        res.send(task);
    }
}

async function getTask(req, res) {
    const task = await taskService.getById(req.params.id)
    res.send(task)
}

async function getTasks(req, res) {
    const tasks = await taskService.query()
    res.send(tasks)
}

async function deleteTask(req, res) {
    await taskService.remove(req.params.id)
    res.end()
}

async function deleteAllTasks(req, res) {
    await taskService.removeAll()
    res.end()
}

async function updateTask(req, res) {
    const task = req.body;
    await taskService.update(task)
    res.send(task)
}


async function addTask(req, res) {
    const task = req.body;
    await taskService.add(task);
    res.send(task);
}

module.exports = {
    getTask,
    getTasks,
    deleteTask,
    deleteAllTasks,
    updateTask,
    addTask,
    performTask
}