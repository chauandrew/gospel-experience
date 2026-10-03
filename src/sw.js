import { precacheAndRoute, matchPrecache } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { createPartialResponse } from 'workbox-range-requests'

// iOS Safari plays <audio> with Range requests and needs 206 replies, which a plain precache
// match does not give. Register this before precacheAndRoute so it wins for .mp3.
registerRoute(
  ({ url }) => url.pathname.endsWith('.mp3'),
  async ({ request }) => {
    const cached = await matchPrecache(request.url)
    return cached ? createPartialResponse(request, cached) : fetch(request)
  },
)

precacheAndRoute(self.__WB_MANIFEST)
