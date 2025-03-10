import closeWithGrace from "close-with-grace";

import app from "./app.js";


await app.listen({ port: app.config.PORT, host: app.config.HOST})

closeWithGrace(async ({ err }) => {
    if (err) {
        app.log.error({ err }, 'server closing due to error')
    }
    app.log.info('Closing db connections')
    await app.db.destroy();
    app.log.info('shutting down gracefully')
    await app.close()
})

