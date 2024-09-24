import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter, OurFileRouter } from "./core";

export const { GET, POST } = createNextRouteHandler({ router: ourFileRouter })