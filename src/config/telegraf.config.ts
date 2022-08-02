import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    TelegrafModuleAsyncOptions,
    TelegrafModuleOptions,
} from 'nestjs-telegraf'
import { session } from 'telegraf'

export const telegrafConfig: TelegrafModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const token = configService.get<string>('BOT_TOKEN')
        // const unicornQuestion = new TelegrafStatelessQuestion('unicorns', ctx => {
        //   console.log('User thinks unicorns are doing:', ctx.message)
        // })
        //
        // // @ts-ignore
        // const stages = new Scenes.Stage([])

        if (token === undefined) {
            throw new Error(
                "Environment variable 'BOT_TOKEN' cannot be undefined",
            )
        }

        return {
            token,
            middlewares: [session()],
        }
    },
    inject: [ConfigService],
}
