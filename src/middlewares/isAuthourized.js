const dbInitialization = require("../models/modelInit");

function authorizeRoles(roles) {
  
  return async (req, res, next) => {
      const {models } = await dbInitialization;
      const { UserOrganisation } = models;
      const { orgId } = req.params;
      const userId = req.user.userId;
  
      try {
        const userOrganisation = await UserOrganisation.findOne({
          where: { userId, orgId },
          attributes: ['role'],
        });
  
        if (!userOrganisation) {
          return res.status(403).json({
            status: false,
            error: "User is not part of this organisation",
          });
        }
  
        if (roles.includes(userOrganisation.role)) {
          return next();
        } else {
          return res.status(403).json({
            status: false,
            error: "Forbidden: Insufficient role",
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: false,
          error: "Internal server error",
          details: error.message,
        });
      }
    };
  }

  module.exports = authorizeRoles
  