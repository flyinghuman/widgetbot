import EmbedController from '@app/controllers/Embed'
import config from '@lib/config'
import logger, { Meta } from '@lib/logger'
import RequireAll from '@utils/requireAll'
import { ApolloServer, PubSub } from 'apollo-server-express'
import async from 'doasync'
import * as http from 'http'
import { createExpressServer } from 'routing-controllers'
import * as GraphQL from 'type-graphql'
import Container, { Service, Inject } from 'typedi'

import Apollo from './apollo'
import authChecker from '@app/authChecker'

const controllers: Constructable[] = new RequireAll(
  require.context('./controllers', true, /\.\/([^\/\.])+(\.ts|\/index)$/)
).exports()

const middlewares: Constructable[] = new RequireAll(
  require.context('./middlewares', true, /\.\/([^\/\.])+(\.ts|\/index)$/)
).exports()

const resolvers: Constructable[] = new RequireAll(
  require.context('../resolvers', true, /\.\/([^\/\.])+(\.ts|\/index)$/)
).exports()

const meta = Meta('Express')

// Dependency injection
GraphQL.useContainer(Container)

@Service('app')
class App {
  constructor(private apollo: Apollo) {}

  public pubsub = new PubSub()
  public schema = GraphQL.buildSchemaSync({
    resolvers,
    authChecker,
    authMode: 'error',
    dateScalarMode: 'timestamp',
    pubSub: this.pubsub
  })

  public app = createExpressServer({
    controllers,
    middlewares
  })

  public apolloServer = new ApolloServer({
    ...this.apollo.options,
    schema: this.schema
  })
  public httpServer: http.Server

  public bootstrap() {
    this.app.set('trust proxy', 'loopback')
    this.apolloServer.applyMiddleware({ app: this.app, path: '/api/graphql' })

    const embed = Container.get(EmbedController)
    embed.use()
  }

  public async start() {
    const { port } = config.express
    if (this.httpServer) return

    this.httpServer = await this.app.listen(port)
    this.apolloServer.installSubscriptionHandlers(this.httpServer)

    logger.info(`🚀 Server ready at http://localhost:${port}`, {
      ...meta(),
      discord: 'status'
    })
  }

  public async stop() {
    if (this.httpServer) {
      await async(this.httpServer).close()
      this.httpServer = null
    }
  }
}

export default App

export * from '@app/context'
