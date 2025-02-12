import * as BunnySDK from "@bunny.net/edgescript-sdk";

/**
 * Returns an HTTP response.
 * @param {Request} request - The Fetch API Request object.
 * @return {Response} The HTTP response or string.
 */
BunnySDK.net.http.serve(async (request) => {

  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');
  const triggerId = searchParams.get('triggerId');

  if(!zone || !triggerId) {
    return new Response(`Please provide valid zone and/or Trigger ID`, { status: 400 });
  }

  try {
    // Purge Bunny CDN cache
    const purgeUrl = `https://api.bunny.net/pullzone/${zone}/purgeCache`;
    const purgeResponse = await fetch(purgeUrl, {
      method: "POST",
      headers: { "AccessKey": process.env.BUNNY_ACCESS_KEY as string },
    });

    // Prepare notification payload
    const status = purgeResponse.ok ? "success" : "error";
    const message = purgeResponse.ok
      ? "Cache purged successfully"
      : `Failed to purge cache: ${await purgeResponse.text()}`;

    // Notify DatoCMS webhook
    await notifyWebhook(triggerId, status, message);

    // Return final response
    return purgeResponse.ok
      ? new Response("Cache purged successfully and notification sent.", { status: 200 })
      : new Response(`Error purging cache: ${message} and notification sent.`, { status: purgeResponse.status });

  } catch (error) {
    const err = error as Error;
    // Notify webhook of failure in case of unexpected error
    await notifyWebhook(triggerId, "error", `Internal Server Error: ${err.message}`);

    return new Response(`Internal Server Error: ${err?.message}`, { status: 500 });
  }
});

  // Notify DatoCMS webhook
const notifyWebhook = async (triggerId, status, message) => {
  await fetch(`https://webhooks.datocms.com/${triggerId}/deploy-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, message }),
  });
}