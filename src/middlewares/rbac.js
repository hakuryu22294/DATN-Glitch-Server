const { ForbiddenError } = require("../core/error.response");
const rbac = require("./role.middleware");

/**
 *
 * @param {string} action // read, delete, update
 * @param {*} resource
 */

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const roleName = req.query.role;
      const premisson = await rbac.can(roleName)[action](resource);
      if (!premisson.granted) {
        throw new ForbiddenError("Permission denied");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = grantAccess;
