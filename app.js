/*
 * Copyright 2012 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var cluster2 = require('cluster2'),
    os = require('os'),
    _ = require('underscore'),
    Console = require('ql.io-console'),
    assert = require('assert');

// Trap all uncaught exception here.
process.on('uncaughtException', function(error) {
    // TODO: This has to the log file
    console.log(error.stack || error);
});


// Process command line args.
var cwd = process.cwd();
var options = {
    cluster: false,
    port: process.env.PORT || 5000,
    monPort: 3001,
    config: cwd + '/config/dev.json',
    tables: cwd + '/tables',
    routes: cwd + '/routes',
    xformers: cwd + '/config/xformers.json',
    disableConsole: false,
    disableQ: false,
    ecv: {
        monitor: '/tables',
        validator: function (status, headers, data) {
            return JSON.parse(data);
        }
    }
};

var emitter;
cluster2.listen(options, function (cb2) {
    createConsole(options, function (app, e) {
        emitter = e;
        cb2(app);
    })
});

function createConsole(options, cb) {
    return new Console({
        'tables': options.tables,
        'routes': options.routes,
        'config': options.config,
        'xformers': options.xformers,
        'enable console': !options.disableConsole,
        'enable q': !options.disableQ,
        'log levels': require('winston').config.syslog.levels}, cb);
}

