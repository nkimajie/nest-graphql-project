import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  appRunning(): string {
    return `Hey champ, your app is running on port ${process.env.PORT || 3000} 🚀🚀🚀🚀🚀`;
  }
}
