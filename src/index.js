const config = {}




let hdls_ls_name = 'hdls_ls' // Local Storage Key storing config and list objects
import {swymPostData, refreshSwymConfig} from "./utils/index"


export const swapi = {
    disconnectUser: () => {
        localStorage.setItem(hdls_ls_name, {});
    },
    authenticateUser: async (customerAccessToken) => {
        refreshSwymConfig(null, false, customerAccessToken);

    },
    createList: async (options = {}) => {
        const configData = await refreshSwymConfig(null);
        console.log(configData)
        options.regid = encodeURIComponent(configData.regid);
        options.sessionid = encodeURIComponent(configData.swymSession.sessionid);

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/create?pid=${encodeURIComponent(config.swymPid)}`,
            options
        );
    },
    fetchLists: async () => {
        const configData = await refreshSwymConfig(null);
        console.log(configData)

        let options = {
            regid: encodeURIComponent(configData.regid),
            sessionid: encodeURIComponent(configData.swymSession.sessionid)
        };

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/fetch-lists?pid=${encodeURIComponent(config.swymPid)}`,
            options
        );
    },
    updateList: async (options = {}) => {
        const configData = await refreshSwymConfig(null);
        console.log(configData)

        options.regid = encodeURIComponent(configData.regid);
        options.sessionid = encodeURIComponent(configData.swymSession.sessionid);

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/update?pid=${encodeURIComponent(config.swymPid)}`,
            options
        );
    },
    deleteList: async (options = {}) => {
        if (regid == null || sessionid == null) {
            await swapi.generateUserIds();
        }

        options.regid = encodeURIComponent(regid);
        options.sessionid = encodeURIComponent(sessionid);

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/delete-list?pid=${encodeURIComponent(config.swymPid)}`,
            options
        );
    },
    fetchListContent: async (options = {}, successCallback) => {
        const configData = await refreshSwymConfig(null);

        options.regid = encodeURIComponent(configData.regid);
        options.sessionid = encodeURIComponent(configData.swymSession.sessionid);

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/fetch-list-with-contents?pid=${encodeURIComponent(config.swymPid)}`,
            options,
            successCallback
        );
    },
    updateListCtx: async (options = {}, successCallback) => {
        const configData = await refreshSwymConfig(null);
  
        options.regid = encodeURIComponent(configData.regid);
        options.sessionid = encodeURIComponent(configData.swymSession.sessionid);

        return await swymPostData(
            `${config.swymHost}/api/v3/lists/update-ctx?pid=${encodeURIComponent(config.swymPid)}`,
            options,
            successCallback
        );
    },
    createSubscription: async (options= {}) => {
        const configData = await refreshSwymConfig(null);
  
        options.regid = encodeURIComponent(configData.regid);
        options.sessionid = encodeURIComponent(configData.swymSession.sessionid);

        return await swymPostData(
            `${config.swymHost}/storeadmin/bispa/subscriptions/create`,
            options
        );
    },
}

export default swapi;


