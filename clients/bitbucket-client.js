const express = require("express");
const request = require("request");
const fetch = require('node-fetch');

const clientId='JbhNemPVNX6MhdPPNS'
const secret='KwFHUJNjZJUPLXf97kFyraQr6Bf35EEK'
const apiUrl='https://bitbucket.org/!api/2.0/'
const authorizeUrl='https://bitbucket.org/site/oauth2'

// const app = express(); 
// const basicAuth = require('basic-auth-connect');
// app.use(basicAuth(clientId, secret));

/*
 *  curl -X POST -u "client_id:secret" \
 * https://bitbucket.org/site/oauth2/access_token \
 * -d grant_type=client_credentials
*/
exports.authorize_ = async function() {
    const options = {
        url: authorizeUrl + '/access_token',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(`${clientId}:${secret}`).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };
    request(options, (error, response, body) => {        
        console.log('token = ', JSON.parse(body).access_token);
    });
}

exports.authorize = async function() {
    const response = await fetch(authorizeUrl + '/access_token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(`${clientId}:${secret}`).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    })
    const body = await response.json();
    console.log('response: ', body);
    return body.access_token;
}

exports.getPullRequestsCount_ = async function(devNick, state, from, to) {
    // const token = await authorize();
    const queryParams = '?q='+ encodeURIComponent(`state=\"${state}\" AND updated_on > ${from} AND updated_on < ${to}`) + '&fields=size';
    // const url = `${apiUrl}/pullrequests/${devNick}${queryParams}`;
    const url = 'https://bitbucket.org/!api/2.0/pullrequests/xxrds?q=state%3D%22MERGED%22+AND+updated_on%3E2022-05-20T00%3A00%3A00+AND+updated_on%3C2022-06-03T23%3A59%3A59';
    console.log(queryParams);
    const options = {
        url: url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ENUK6OKd29UbRZpyAw5NhUxUyDhx_kMKehbtmWuRFqNyXxYM4-j4yDI3smauW450i6AkMJv8YMm58sNtFcbyrZOvz5a5OwnjnKaRrAIVhNM8RYycgocfv7_7`
        }
        // params: {
        //     q: escape(`state=\"${state}\" AND updated_on > ${from} AND updated_on < ${to}`),
        //     fields: 'size'
        // }
    };
    request(url, (error, response, body) => {
        console.log(body);
    });
}

exports.getPullRequestsCount = async function(devNick, state, from, to) {
    const queryParams = '?q=' + escape(`state=\"${state}\" AND updated_on > ${from} AND updated_on < ${to}`) + '&fields=size';
    const response = await fetch(`${apiUrl}/pullrequests/${devNick}${queryParams}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer jjzEOHcjGYTdA9WVUglBsl2gbO4Ck75polHgNF1a8PmLTtYH8UN7SM6ATBkIXddsDp8JSojBkpSZneW-34aCaSio6rqxFH4dMX9JsnbvfLHHZZW7ddSkQj0=',
            'Accept': 'application/json'
        }
    })
    const body = await response.json();
    console.log('response: ', body);
    return body;
}

exports.getFromLocalBackend = async function(user, state, from, to) {
    const response = await fetch(`http://localhost:8080/pullRequests/${user}/${state}?from=${from}&to=${to}`);
    return response.json();
}