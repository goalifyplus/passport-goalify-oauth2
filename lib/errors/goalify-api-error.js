/**
 * `GoalifyAPIError` error.
 *
 * References:
 *   - https://developers.google.com/+/web/api/rest/
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function GoalifyAPIError(message, code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'GoalifyAPIError';
    this.message = message;
    this.code = code;
}

// Inherit from `Error`.
GoalifyAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = GoalifyAPIError;
