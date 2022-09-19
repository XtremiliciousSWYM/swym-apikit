import config from "../config"

let hdls_ls_name = 'hdls_ls' // Local Storage Key storing config and list objects



export const swymPostData = async (url = "", data = {}, successCallback, failureCallback) => {

    var urlencoded = new URLSearchParams()
    for (const key in data) {
        let dataValue = data[key];
        if (Array.isArray(dataValue)) {

            dataValue = JSON.stringify(data[key])
        }
        urlencoded.append(key, dataValue)
    }


    console.log(url, data, "CALL")

    // Default options are marked with *
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
    }).then(function (response) {
        console.log(response);
        if (successCallback) {
            successCallback(response.data)
        }
        return response;

    }).catch(function (error) {
        console.log(error);
        if (failureCallback) {
            failureCallback(error);
        }

        return error;
    });
}

function createSwymSession(len) {
    // Len is length usually 64
    var outStr = '',
        newStr
    while (outStr.length < len) {
        newStr = Math.random().toString(36 /*radix*/).slice(2 /* drop decimal*/)
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length))
    }

    var timestamp = Date.now()

    var swymSession = {
        sessionid: outStr.toLowerCase(),
        timestamp: timestamp,
    }

    return swymSession
}

function compareTimestamp(endDate, startDate) {
    var diff = endDate - startDate
    return diff / 60000
}


export async function initDefaultWishlist(swymConfig) {
    console.log('Hdls - Fetching or Creating List for Current Regid')

    return fetch(
        `${config.swymHost
        }/api/v3/lists/fetch-lists?pid=${encodeURIComponent(
            config.swymPid
        )}`,
        {
            body: `regid=${swymConfig.regid}&sessionid=${swymConfig.sessionid}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.length) {
                console.log('Hdls - List Fetched for User')

                return data[0]
            } else {
                return fetch(
                    `${config.swymHost
                    }/api/v3/lists/create?pid=${encodeURIComponent(
                        config.swymPid
                    )}`,
                    {
                        body: `lname=${config.swymLname}&sessionid=${swymConfig.sessionid}&regid=${swymConfig.regid}`,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Hdls - List Created for User')

                        return data
                    })
            }
        })
}

export async function refreshSwymConfig(swymConfig, skipCheck = false, token = null) {


    if (window._isSwymLoading && !skipCheck) {
        return;
    }

    var hdls_ls = JSON.parse(localStorage.getItem(hdls_ls_name))

    window._isSwymLoading = true;
    var swymConfigData = { ...hdls_ls, ...swymConfig }

    //console.log(swymConfigData)

    if (swymConfigData == null || Object.keys(swymConfigData).length === 0 || token) {
        console.log('Regid not found on refresh', swymConfig)

        var swymRegid = await generateSwymConfig(token)
        swymConfigData = { ...swymRegid }
        return refreshSwymConfig(swymConfigData, true)
    } else if (
        swymConfigData.swymSession != null &&
        compareTimestamp(Date.now(), swymConfigData.swymSession.timestamp) >= 30
    ) {
        var swymSession = { swymSession: createSwymSession(24) }
        swymConfigData = { ...swymConfigData, ...swymSession }

        console.log('SwymSession not found on refresh', swymSession, swymConfigData)

        return refreshSwymConfig(swymConfigData, true)
    } else if (typeof swymConfigData.lid == 'undefined') {
        console.log('List not found on refresh', swymConfigData)

        var list = await initDefaultWishlist(swymConfigData)
        swymConfigData = { ...swymConfigData, ...list }
        localStorage.setItem(hdls_ls_name, JSON.stringify(swymConfigData))

        window._isSwymLoading = false;
        return swymConfigData
    } else {
        localStorage.setItem(hdls_ls_name, JSON.stringify(swymConfigData))

        window._isSwymLoading = false;
        return swymConfigData
    }
}

async function getCustomerEmail(customerToken) {
    var myHeaders = new Headers()
    myHeaders.append(
        'X-Shopify-Storefront-Access-Token',
        config.storefrontAccessToken
    )
    myHeaders.append('Content-Type', 'application/json')

    var graphql = JSON.stringify({
        query: `{\n  customer(customerAccessToken : "${customerToken}") {\n    id\n    firstName\n    lastName\n    acceptsMarketing\n    email\n    phone\n  }\n}`,
        variables: {},
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
    }

    return fetch(config.storefrontGraphqlEndpoint, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            return result
        })
        .catch((error) => console.log('error', error))
}

function createSessionid(len) {
    // Len is length usually 64
    var outStr = '',
        newStr
    while (outStr.length < len) {
        newStr = Math.random().toString(36 /*radix*/).slice(2 /* drop decimal*/)
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length))
    }

    var timestamp = Date.now()

    var swymSession = {
        sessionid: outStr.toLowerCase(),
        timestamp: timestamp,
    }

    return outStr.toLowerCase()
}

export async function generateSwymConfig(customerToken) {
    if (customerToken != null) {

        var data = await getCustomerEmail(customerToken)

        console.log(data.data.customer)
        var hdls_ls = JSON.parse(localStorage.getItem(hdls_ls_name))

        if(hdls_ls?.regid == null){
            hdls_ls = await generateSwymConfig();
        }

        var extuid = window
            .atob(data.data.customer.id)
            .split('gid://shopify/Customer/')[1]

        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

        var urlencoded = new URLSearchParams()
        urlencoded.append('regid', hdls_ls.regid)
        urlencoded.append('sessionid', hdls_ls.swymSession.sessionid)
        urlencoded.append('platform', 'shopify')
        urlencoded.append('extuid', parseInt(extuid))

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        }

        return fetch(
            `https://swymstore-v3dev-01-01.swymrelay.com/api/v3/lists/user-validate-sync?pid=${encodeURIComponent(
                config.swymPid
            )}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Hdls - User Login Detected and RegID generated', result)

                const swymConfig = {
                    regid: result.regid,
                    swymSession: {
                        sessionid: createSessionid(32),
                        timestamp: Date.now(),
                    },
                }

                return swymConfig
            })
            .catch((error) => {
                console.log('error', error)

                return error
            })
    } else {
        return fetch(
            `${config.swymHost
            }/api/v3/provider/register?pid=${encodeURIComponent(
                config.swymPid
            )}`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Hdls - User Logout Detected and RegID generated')

                const swymConfig = {
                    regid: result.regid,
                    swymSession: createSwymSession(24),
                }

                return swymConfig
            })
            .catch((error) => {
                console.log('error', error)

                return error
            })
    }
}

