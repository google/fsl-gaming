// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const UserService = require('../service/UserService');

exports.benchMarkInsertUser = params => UserService.benchMarkInsertUser(params);

exports.createUser = params => UserService.createUser(params);

exports.getAllUsers = () => UserService.getAllUsers();

exports.getUserByID = params => UserService.getUserByID(params);

exports.updateUser = (id, params) => UserService.updateUser(id, params);
