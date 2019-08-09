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


var localStorageKey = {
    flData: 'flData',
    labeledData: 'labeledData'
}

getObjectFromLocalStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
}

setObjectToLocalStorage = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        var labeledData = getObjectFromLocalStorage(localStorageKey.labeledData);
        if (labeledData == null || labeledData == undefined) {
            setObjectToLocalStorage(localStorageKey.labeledData, {});
        }
        var flData = getObjectFromLocalStorage(localStorageKey.flData);
        if (flData == null || flData == undefined) {
            flData = {};
            getData();
        } else {
            makePagination();
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    onDeviceReady: function () {
    },
};

getData = function () {
    var url = 'https://raw.githubusercontent.com/e9t/nsmc/master/ratings_test.txt';
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            response = response.split('\n');
            response.shift();
            // response = response.splice(0, 100);
            var flData = new Array();
            response.forEach(function (line) {
                line = line.split('\t');
                // flData[line[0]] = { document: line[1], label: line[2] };
                flData.push({ id: line[0], document: line[1], label: line[2] });
            });
            setObjectToLocalStorage(localStorageKey.flData, flData);
            makePagination();
        }
    });
}

function simpleTemplating(data) {
    $('#data-container').html('');
    var labeledData =  getObjectFromLocalStorage(localStorageKey.labeledData);
    for (var i in data) {
        var liElement = document.createElement("li");
        var likeBtn = document.createElement("button");
        var dislikeBtn = document.createElement("button");

        $(liElement).attr("key", data[i].id);
        $(liElement).html(data[i].document);
        $(likeBtn).html("like");
        $(likeBtn).click(clickedLike);
        $(dislikeBtn).html("dislike");
        $(dislikeBtn).click(clickedDislike);

        if (!labeledData[data[i].id]) {
            $(liElement).append(likeBtn);
            $(liElement).append(dislikeBtn);   
        }

        $("#data-container").append(liElement);
    }
}

makePagination = function () {
    $('#pagination-container').pagination({
        dataSource: getObjectFromLocalStorage(localStorageKey.flData),
        pageSize: 20,
        callback: function (data, pagination) {
            simpleTemplating(data);
        }
    });
}

clickedLike = function (e) {
    clickedReview(e, 1);
}

clickedDislike = function (e) {
    clickedReview(e, 0);
}

clickedReview = function (e, isLike) {
    e.preventDefault();
    var key = $(e.target).parent().attr("key");
    var flData = getObjectFromLocalStorage(localStorageKey.flData);
    var labeledData = getObjectFromLocalStorage(localStorageKey.labeledData);
    for (var i in flData) {
        if (flData[i].id == key) {
            labeledData[key] = flData[i];
            labeledData[key].label = isLike;
            // flData.splice(i, 1);
            break;
        }
    }
    setObjectToLocalStorage(localStorageKey.labeledData, labeledData);
    // setObjectToLocalStorage(localStorageKey.flData, flData);
    makePagination();
}

app.initialize();