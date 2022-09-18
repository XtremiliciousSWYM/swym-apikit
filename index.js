var axios = require("axios");
var qs = require("qs");
var btoa = require("btoa");
var urlencode = require("urlencode");

const APIKey =
    "TiOdHz8t-CGg-hV6M_k092P1LHOwiFziFc2HAeD9dhbPtdaVeJHlKzCADds56IH9INOoNscLqWqcQUTcDgANfw";
const PID = "KABSbuGyYCuM6/IV7e7cGxT1978LieU1jRdMt6XhYfo=";
const Endpoint = "https://swymstore-v3premium-01.swymrelay.com";

var regid = null;
var sessionid = null;

function generateSessionId(len) {
    var outStr = "",
        newStr;
    while (outStr.length < len) {
        newStr = Math.random().toString(36 /*radix*/).slice(2 /* drop decimal*/);
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }

    return outStr.toLowerCase();
}

async function swymPostData(url = "", data = {}, successCallback, failureCallback) {

    var data = qs.stringify(data);


    console.log(url, data)

    // Default options are marked with *
    return await axios({
        method: "post",
        url: url,
        headers: {
            Authorization: "Basic " + btoa(`${PID}:${APIKey}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
    }).then(function (response) {
        //console.log(response.data);
        if (successCallback) {
            successCallback(response.data)
        }
        return response.data;

    }).catch(function (error) {
        console.log(error);
        if (failureCallback) {
            failureCallback(error);
        }

        return error;
    });
}

async function generateUserIds(userEmail = "nilarjun.das@swymcorp.com") {
    const userIds = await swymPostData(
        `${Endpoint}/storeadmin/user/generate-regid?useremail=${userEmail}`,
        { useragenttype: "mobileApp" }
    );
    console.log("data: ", userIds);
    regid = userIds["regid"];
    sessionid = userIds["sessionid"];
}


async function createList(options) {
    if (regid == null || sessionid == null) {
        await generateUserIds();
    }
    options.regid = urlencode(regid);
    options.sessionid = urlencode(sessionid);

    //console.log(options);

    return await swymPostData(
        `${Endpoint}/api/v3/lists/create?pid=${urlencode(PID)}`,
        options
    );
}

async function fetchLists() {
    if (regid == null || sessionid == null) {
        await generateUserIds();
    }
    let options = {};
    options.regid = urlencode(regid);
    options.sessionid = urlencode(sessionid);

    //console.log(options);

    return await swymPostData(
        `${Endpoint}/api/v3/lists/fetch-lists?pid=${urlencode(PID)}`,
        options
    );
}

//generateUserIds();
fetchLists({
   lname: "New Test List"
}).then((response) => {
    console.log(response)
})

module.exports = generateUserIds;
