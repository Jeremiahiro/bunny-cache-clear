import * as BunnySDK from "@bunny.net/edgescript-sdk";

BunnySDK.net.http.serve(async (request) => {

    console.log(`[INFO]: ${request.method} - ${request.url}`);

    return new Response(`Please provide valid zone and/or Trigger ID`);

})