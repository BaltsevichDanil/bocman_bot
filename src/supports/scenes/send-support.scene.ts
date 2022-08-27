import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { SceneNameEnum } from '../../enums/scene-name.enum'
import { SupportsService } from '../supports.service'

@Scene(SceneNameEnum.SEND_SUPPORT)
export class SendSupportScene {
    constructor(private readonly _supportsService: SupportsService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.reply(
            'Очень жаль, что ты столкнулся с проблемой😒\nОпиши ее как можно подробнее, и мы постараемся ее решить',
        )
    }

    @On('text')
    async onText(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        if (ctx.chat?.id) {
            const support = await this._supportsService.createSupport({
                chat_id: ctx.chat.id,
                text: ctx.message.text,
            })
            await ctx.reply(
                `Индетификатор обращения: ${support.id}\n\nСпасибо! Твое обращение отправлено моим создателям`,
            )
        }
        await ctx.scene.leave()
    }
}
