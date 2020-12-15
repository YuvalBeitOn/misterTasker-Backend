const dbService = require('../../services/db.service');
const externalService = require('./external.service');
const socketService = require ('../socket/socket-service');

const ObjectId = require('mongodb').ObjectId;

module.exports = {
	query,
	getById,
	remove,
	removeAll,
	update,
	add,
	performTasks
};

performTasks()

async function query(filterBy = {}) {
	const collection = await dbService.getCollection('task');
	try {
		const tasks = await collection.find(filterBy).toArray();
		return tasks;
	} catch (err) {
		console.log('Task SERVICE: Cannot load tasks.');
		throw err;
	}
}
//NOTE
async function getById(taskId) {
	const collection = await dbService.getCollection('task');
	try {
		const task = await collection.findOne({ _id: ObjectId(taskId) });
		return task;
	} catch (err) {
		console.log(`Task SERVICE - ERROR: while finding task ${taskId}`);
		throw err;
	}
}

async function remove(taskId) {
	const collection = await dbService.getCollection('task');
	try {
		await collection.deleteOne({ _id: ObjectId(taskId) });
	} catch (err) {
		console.log(`Task SERVICE - ERROR: cannot remove task ${taskId}`);
		throw err;
	}
}


async function removeAll() {
	const collection = await dbService.getCollection('task');
	try {
		await collection.deleteMany({ });
	} catch (err) {
		console.log(`Task SERVICE - ERROR: cannot remove tasks`);
		throw err;
	}
}


async function update(task) {
	const collection = await dbService.getCollection('task');
	task._id = ObjectId(task._id);
	try {
		console.log('Task SERVICE: Attempting update...');
		const savedTask = await collection.replaceOne({ _id: task._id }, task);
		return savedTask;
	} catch (err) {
		console.log(`Task SERVICE - ERROR: Cannot update task ${task._id}`);
		throw err;
	}
}

async function add(task) {
	const collection = await dbService.getCollection('task');
	try {
		await collection.insertOne(task);
		return task;
	} catch (err) {
		console.log(`Task SERVICE - ERROR: Cannot add task.`);
		throw err;
	}
}



async function intervalTasks() {
	let tasks = await query()
	tasks = tasks.filter(task => {
		return !task.doneAt
	});
	if (tasks.length) {
		let minTriesCount = Infinity;
		tasks.forEach(task => {
			if (task.triesCount < minTriesCount) minTriesCount = task.triesCount
		})
		tasks = tasks.filter(task => task.triesCount === minTriesCount)
		tasks.sort((task1, task2) => {
			return task2.importance - task1.importance
		})
		const task = tasks[0]
		try {
			console.log('executing!', 'importance:', task.importance, 'triesCount:',  task.triesCount);
			await externalService.execute(task)
			task.doneAt = Date.now()
			console.log('executing succsed');
		} catch {
			task.triesCount += 1;
			console.log(`Task SERVICE - ERROR: execute faild.`);
		} finally {
			task.lastTriedAt = Date.now()
			update(task)
			socketService.emitUpdateTask(task)

		}
	} 
	// else {
	// 	console.log('No tasks to perform :)');
	// }
}

async function performTasks() {
	setInterval(intervalTasks, 1000);
}

