/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const topicContract = require('./lib/topicContract');

module.exports.TopicContract = topicContract;
module.exports.contracts = [topicContract];
