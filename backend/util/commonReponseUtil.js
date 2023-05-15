const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("../constants/response");

/**
 * returns the common response
 * @param error {Object} error executing db query
 * @param document {Object} document returned by db
 * @param response {Object} to pass on the response
 * @returns {Object} response
 */
const getResponse = (error, document, response) => {
  if (error) {
    console.log(error);
    return response.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
  if (!document) {
    return response.status(400).json({ message: BAD_REQUEST });
  }
  return response.json(document);
};

module.exports = {
  getResponse,
};
