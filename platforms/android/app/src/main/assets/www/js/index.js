/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    onDeviceReady: function () {
        getData();
    },
};

var flData = new Array();

getData = function () {
    var url = 'https://raw.githubusercontent.com/e9t/nsmc/master/ratings_test.txt';
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            response = response.split('\n');
            response.shift();
            response.forEach(function (line) {
                line = line.split('\t');
                flData.push({ id: line[0], document: line[1], label: line[2] });
            });
            console.log('suc get data');
        }
    });
}

app.initialize();