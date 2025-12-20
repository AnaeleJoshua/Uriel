const router = require('express').Router()
const isAuthenticated = require('../../middlewares/IsAuthenticatedMiddleware')

const ProjectController = require('./project.controller')

module.exports = async ()=>{
    const controller = await ProjectController();
    router.post('/', [isAuthenticated.check], controller.createProject)
router.put('/:id', [isAuthenticated.check], controller.updateProject)
router.patch('/:id/archive', [isAuthenticated.check], controller.archiveProject)
router.patch('/:id/unarchive', [isAuthenticated.check], controller.unArchiveProject)
router.delete('/:id', [isAuthenticated.check], controller.deleteProject)
router.get('/:id', [isAuthenticated.check], controller.getProjectById)
router.get('/', [isAuthenticated.check], controller.getAllProjects)

return router
}