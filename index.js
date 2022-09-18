const urlencode = require("urlencode");

const utils = require('./utils');

const pid = "KABSbuGyYCuM6/IV7e7cGxT1978LieU1jRdMt6XhYfo=";
const endpoint = "https://swymstore-v3premium-01.swymrelay.com";

let regid = null;
let sessionid = null;

const swapi = {
    generateSessionId: (len) => {
        var outStr = "",
            newStr;
        while (outStr.length < len) {
            newStr = Math.random().toString(36 /*radix*/).slice(2 /* drop decimal*/);
            outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
        }
        return outStr.toLowerCase();
    },
    generateUserIds: async (userEmail = "nilarjun.das@swymcorp.com", useragenttype = "mobileApp") => {
        const userIds = await utils.swymPostData(
            `${endpoint}/storeadmin/user/generate-regid?useremail=${userEmail}`,
            { useragenttype: useragenttype }
        );

        regid = userIds["regid"];
        sessionid = userIds["sessionid"];

        return userIds;
    },
    createList: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }
        options.regid = urlencode(regid);
        options.sessionid = urlencode(sessionid);

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/create?pid=${urlencode(pid)}`,
            options
        );
    },
    fetchLists: async () => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        let options = {
            regid: urlencode(regid),
            sessionid: urlencode(sessionid)
        };

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/fetch-lists?pid=${urlencode(pid)}`,
            options
        );
    },
    updateList: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        options.regid = urlencode(regid);
        options.sessionid = urlencode(sessionid);

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/update?pid=${urlencode(pid)}`,
            options
        );
    },
    deleteList: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        options.regid = urlencode(regid);
        options.sessionid = urlencode(sessionid);

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/delete-list?pid=${urlencode(pid)}`,
            options
        );
    },
    fetchListContent: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        options.regid = urlencode(regid);
        options.sessionid = urlencode(sessionid);

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/fetch-list-with-contents?pid=${urlencode(pid)}`,
            options
        );
    },
    updateListCtx: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        options.regid = urlencode(regid);
        options.sessionid = urlencode(sessionid);

        return await utils.swymPostData(
            `${endpoint}/api/v3/lists/update-ctx?pid=${urlencode(pid)}`,
            options
        );
    },
    createSubscription: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        return await utils.swymPostData(
            `${endpoint}/storeadmin/bispa/subscriptions/create`,
            options
        );
    },
}

module.exports = swapi;
