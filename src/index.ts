import * as BunnySDK from "@bunny.net/edgescript-sdk";

/**
 * Returns an HTTP response.
 * @param {Request} request - The Fetch API Request object.
 * @return {Response} The HTTP response or string.
 */
BunnySDK.net.http.serve(async (request) => {

console.log(request)
return new Response(`Please provide valid zone and/or Trigger ID`);

});
