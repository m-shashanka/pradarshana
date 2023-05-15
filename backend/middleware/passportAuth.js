const passport = require("passport");
const ROLES = require("../constants/roles");
const { BAD_REQUEST, FORBIDDEN } = require("../constants/response");
const { ADMIN } = require("../constants/roles");

const permitAllUsers = passport.authenticate(ROLES.ALL_USERS, {
  session: false,
});

const authorizeProfessor = passport.authenticate(ROLES.PROFESSOR, {
  session: false,
});

const authorizeStudent = passport.authenticate(ROLES.STUDENT, {
  session: false,
});

const authorizeAdmin = passport.authenticate(ROLES.ADMIN, { session: false });

/**
 * Certain api's can only be access by the owner
 * to detect illegal access
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const authorizeOwnership = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: BAD_REQUEST });
  } else if (!req.user.roles.includes(ADMIN) && req.user.id !== id) {
    res.status(403).json({ message: FORBIDDEN });
  } else {
    return next();
  }
};

module.exports = {
  permitAllUsers,
  authorizeStudent,
  authorizeProfessor,
  authorizeAdmin,
  authorizeOwnership,
};
