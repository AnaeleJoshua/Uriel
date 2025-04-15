const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const OrganisationController = require('../controllers/organisationsController')
const SchemaValidationMiddleware = require('../middlewares/SchemaValidationMiddleware')
const isAuthorized = require('../middlewares/isAuthourized')


//payload import
const organisationPayload = require('../schemas/organisation')


router.route('/').get([isAuthenticated.check,OrganisationController.getAllOrganisation]).post([SchemaValidationMiddleware.verify(organisationPayload),isAuthenticated.check,OrganisationController.newOrganisation])
router.get('/:orgId',[isAuthenticated.check,OrganisationController.getOrganisationById])
router.get('/:orgId/allUsers',[isAuthenticated.check,isAuthorized(['admin','owner']),OrganisationController.getAllOrganisationUsers])
router.post('/:orgId/addUser',[isAuthenticated.check,isAuthorized(['admin','owner']),OrganisationController.addUserToOrganisation])
router.patch('/:orgId/assign-Admin',[isAuthenticated.check,isAuthorized(['owner']),OrganisationController.assignAdmin])
router.patch('/:orgId/removeAdmin',[isAuthenticated.check,isAuthorized(['owner']),OrganisationController.removeAdmin])
router.delete('/:orgId/remove-user',[isAuthenticated.check,isAuthorized(['owner','admin']),OrganisationController.removeUserFromOrganisation])
router.post('/:orgId/leave',[isAuthenticated.check,OrganisationController.removeUserFromOrganisation])
module.exports = router