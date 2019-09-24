const url = require('url');
const qs = require('querystring');
const helpers = require('./helpers');
const routes = {};
// The run method invokes controllers to handle incoming requests
routes.run = (req, res, user, dataBody) => {
    // Ensure that the content type is JSON
    if (req.headers.hasOwnProperty('Accept')) {
        if (req.headers['Accept'].toLowerCase() !== 'application/json') {
            helpers.errors.outputError(res, { code: 406 }, 'Not Acceptable. Set content-type header to application/json');
            return;
        }
    }

    // Get the endpoint where the request was forwarded
    const requestUrl = url.parse(req.url);
    const endpoint = requestUrl.pathname.replace(/^\/+|\/+$/gi, '');

    // Get the requested routes
    const endpointParts = endpoint.split('/');

    // Process The User's Request
    if (['', '/'].indexOf(endpoint) > -1) {
        res.statusCode = 200;
        res.end(JSON.stringify({
            response: 'Cecula API',
            routes: {
                'balance': '/account/balance',
                'a2p': '/send/a2p',
                'p2p': '/send/p2p'
            }
        }));
    } else {
        var controller;
        if (endpointParts[0].length > 0) {
            try {
                controller = require('./controllers/' + endpointParts[0]);
            } catch (error) {
                console.log(error)
                helpers.errors.outputError(res, { code: 404 }, 'The requested resource was not found')
                return;
            }
        }

        // Set the request method
        controller.request.method = req.method.toLowerCase();
        // Pass the query parameters to the controller
        controller.request.query = requestUrl.query === null ? {} : qs.parse(requestUrl.query);
        // Pass User Data to the Controller
        controller.auth.user = user[0];
        // Pass received data to the controller
        if (dataBody.length) {
            try {
                controller.request.data = JSON.parse(dataBody);
            } catch (error) {
                helpers.errors.outputError(res, { code: 400 }, 'Bad Request. Malformed JSON.');
            }
        }
        // If user did not specify an action, set it to index
        const action = typeof endpointParts[1] === 'undefined' ? 'index' : endpointParts[1].toLowerCase();

        if (typeof controller[action] === 'function') {
            controller[action]((response) => {
                res.statusCode = 200;
                res.end(JSON.stringify(response));
            }, (controllerResponse) => {
                helpers.errors.outputError(res, controllerResponse);
            });
        } else {
            helpers.errors.outputError(res, { code: 404 });
        }
    }
};

routes.successHandler = () => {

};

module.exports = routes;