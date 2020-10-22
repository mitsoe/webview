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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');

  document.querySelector('#login').addEventListener('click', open);
  document.querySelector('#identify').addEventListener('click', identify);

  function identify() {
    const url = 'https://mahuls-prod.plnd.cloud/identify';
    window.cordova.plugins.CookiesPlugin.getCookie('https://mahuls-prod.plnd.cloud/', cookies => {
      // log cookies
      cookies.split(';').forEach(cookie => {
        window.cordova.plugin.http.setCookie(url, cookie);
      });

      fetch(url)
        .then(responseData => responseData.data)
        .then(data => JSON.parse(data))
        .then(jsonData => alert(jsonData.loggedin));

      function reqListener() {
        alert(this.responseText);
      }

      var oReq = new XMLHttpRequest();
      oReq.addEventListener('load', reqListener);
      oReq.open('GET', url);
      oReq.send();
    });
  }

  fetch = function(url) {
    return new Promise(function(resolve, reject) {
      window.cordova.plugin.http.get(
        url,
        null,
        null,
        function(response) {
          return resolve(response);
        },
        function(errorResponse) {
          return reject(errorResponse);
        }
      );
    });
  };

  function open() {
    const url = 'https://mahuls-prod.plnd.cloud/';
    var ref = cordova.InAppBrowser.open(url, '_blank', 'clearsessioncache=no,clearcache=no,usewkwebview=yes');

    ref.addEventListener('loadstop', loadStopCallBack);

    function loadStopCallBack() {
      window.cordova.plugins.CookiesPlugin.getCookie(url, cookies => {
        // log cookies
        cookies.split(';').forEach(cookie => {
          window.cordova.plugin.http.setCookie(url, cookie);
        });
      });
    }
  }
}
