const express = require('express')
    // const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { getTask, getTasks, deleteTask, updateTask, addTask, performTask, deleteAllTasks } = require('./task.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getTasks)
router.get('/:id', getTask)
router.post('/', addTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.delete('/', deleteAllTasks)
router.put('/:id/start', performTask)

module.exports = router