import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { channelName } from '../../constants/constants'
import { RoleEnum } from '../../enums/role.enum'
import { TelegramService } from '../telegram.service'

@Scene('suspect')
export class ShowSuspectsScene {
    constructor(private readonly _telegramService: TelegramService) {}

    @SceneEnter()
    async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const user = await this._telegramService.findUser(ctx.chat.id)
            if (user?.role === RoleEnum.ADMIN) {
                const suspects = await this._telegramService.getSuspects()
                const suspect = suspects[0]
                if (suspect) {
                    await ctx.telegram.copyMessage(
                        ctx.chat.id,
                        channelName,
                        suspect.video.message_id,
                        {
                            caption: `Кто жаловался ${suspect.who_complained}\nЧье видео ${suspect.video.owner_chat_id}\nТекст ${suspect.video.text}`,
                        },
                    )
                    await ctx.replyWithMarkdownV2('Решение', {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '👍', callback_data: 'good' },
                                    { text: '🤡', callback_data: 'bad' },
                                ],
                            ],
                        },
                    })
                    // @ts-ignore
                    ctx.scene.state.message_id = suspect.video.message_id
                } else {
                    await ctx.reply('Подозреваемых нет')
                    await ctx.scene.leave()
                }
            } else {
                await ctx.scene.leave()
            }
        }
    }

    @Action(/good|bad/)
    async onGood(
        @Ctx()
        ctx: Scenes.SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        // @ts-ignore
        const { message_id } = ctx.scene.state
        if (userAnswer === 'good' && message_id) {
            await this._telegramService.deleteFromSuspect(message_id)
        }
        if (userAnswer === 'bad' && message_id) {
            await this._telegramService.banVideo(message_id)
        }
        await ctx.scene.reenter()
    }
}
