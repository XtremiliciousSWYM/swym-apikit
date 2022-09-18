const axios = require("axios");
const qs = require("qs");
const btoa = require("btoa");

const apikey =
    "TiOdHz8t-CGg-hV6M_k092P1LHOwiFziFc2HAeD9dhbPtdaVeJHlKzCADds56IH9INOoNscLqWqcQUTcDgANfw";
const pid = "KABSbuGyYCuM6/IV7e7cGxT1978LieU1jRdMt6XhYfo=";
const endpoint = "https://swymstore-v3premium-01.swymrelay.com";

const swymPostData = async (url = "", data = {}, successCallback, failureCallback) => {

    var data = qs.stringify(data);


    console.log(url, data)

    // Default options are marked with *
    return await axios({
        method: "post",
        url: url,
        headers: {
            Authorization: "Basic " + btoa(`${pid}:${apikey}`),
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


module.exports = { swymPostData }