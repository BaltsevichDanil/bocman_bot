import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { channelName } from '../../constants/constants'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { clearText } from '../../helpers/clearText'
import { VideosService } from '../videos.service'

@Scene(SceneNameEnum.FIND_VIDEO)
export class FindVideoScene {
    constructor(private readonly _videosService: VideosService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.reply(
            'Чтобы найти какое-то видео введи ключевые слова из него',
        )
    }

    @On('text')
    async onTextInput(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        if (ctx.message.text === '/cancel') {
            await ctx.reply('Выхожу-выхожу')
            await ctx.scene.leave()
        } else {
            const video = await this._videosService.findVideoByText(
                clearText(ctx.message.text),
            )
            if (!video) {
                await ctx.reply('Ничего не нашлось🥲')
                await ctx.scene.leave()
            } else if (video && ctx.chat?.id) {
                await ctx.telegram.copyMessage(
                    ctx.chat.id,
                    channelName,
                    video.message_id,
                )
                await ctx.scene.leave()
            }
        }
    }
}
