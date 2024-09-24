import { app } from '~/app.ts'
import { env } from '~/env.ts'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running on ${env.BASE_URL}`)
  })
