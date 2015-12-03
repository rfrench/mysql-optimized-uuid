'use strict';

var uuid = require('node-uuid');
var validator = require('validator');

/**
 * OptimizedUUID Constructor
 * Based on the blog @ https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/
 * Converts a standard UUID v1 to an optimized version for storing UUIDs in a binary(16) field
 * Example: 58e0a7d7-eebc-11d8-9669-0800200c9a66 -> 11D8EEBC58E0A7D796690800200C9A66
 * @constructor
 * @private
 */
function OptimizedUUID() {}

/**
 * create an optimized uuid
 * @param  {Object}  options - (optional)
 * @return {String}
 */
OptimizedUUID.prototype.create = function(options) {
  var id = uuid.v1(options).split('-');

  // arrange it to the "optimized" version
  var optimized = [ id[2], id[1], id[0], id[3], id[4] ];
  
  // join it together and convert it to upper case
  return optimized.join().toUpperCase();
};

/**
 * reverses an optimized uuid back to a standard uuid v1
 * @param  {String}  id
 * @return {String}
 */
OptimizedUUID.prototype.reverse = function(id) {
  if ((!id) || (id.length !== 32)) {
    return null;
  }

  // rearrange it back to a standard uuid v1
  var unoptimized = [
    id.substr(8, 8),
    id.substr(4, 4),
    id.substr(0, 4),
    id.substr(16, 4),
    id.substr(20, 12)
  ];

  // join it back together and convert it back to lower case
  return unoptimized.join('-').toLowerCase();
};

/**
 * determines if an optimized uuid is a valid uuid
 * @param  {String}  id
 * @return {String}
 */
OptimizedUUID.prototype.isValid = function(id) {
  var self = this;

  // reverse it
  var unoptimized = self.reverse(id);
  if (!unoptimized) {
    return false;
  }

  return validator.isUUID(unoptimized);
};

module.exports = new OptimizedUUID();