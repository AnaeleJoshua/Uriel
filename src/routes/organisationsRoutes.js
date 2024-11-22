const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const OrganisationController = require('../controllers/organisationsController')
const SchemaValidationMiddleware = require('../middlewares/SchemaValidationMiddleware')


//payload import
const organisationPayload = require('../schemas/organisation')


router.route('/').get([isAuthenticated.check,OrganisationController.getAllOrganisation]).post([SchemaValidationMiddleware.verify(organisationPayload),isAuthenticated.check,OrganisationController.newOrganisation])
router.get('/:orgId',[isAuthenticated.check,OrganisationController.getOrganisationById])
router.post('/:orgId/users',[isAuthenticated.check,OrganisationController.addUserToOrganisation])
module.exports = router