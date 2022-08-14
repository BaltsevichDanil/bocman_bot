import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SceneContext } from 'telegraf/typings/scenes'

import { channelName } from '../../constants/constants'
import { ControlCommandEnum } from '../../enums/control-command.enum'
import { RoleEnum } from '../../enums/role.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { UsersService } from '../../users/users.service'
import { SuspectsService } from '../suspects.service'

@Scene(SceneNameEnum.SHOW_SUSPECTS)
export class ShowSuspectsScene {
    constructor(
        private readonly _suspectsService: SuspectsService,
        private readonly _usersService: UsersService,
    ) {}

    @SceneEnter()
    async onStart(@Ctx() ctx: SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const user = await this._usersService.findUser(ctx.chat.id)
            if (user?.role === RoleEnum.ADMIN) {
                const suspects = await this._suspectsService.getSuspects()
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
                                    {
                                        text: '👍',
                                        callback_data: ControlCommandEnum.GOOD,
                                    },
                                    {
                                        text: '🤡',
                                        callback_data: ControlCommandEnum.BAD,
                                    },
                                ],
                            ],
                        },
                    })
                    ;(ctx.scene.state as { message_id: number }).message_id =
                        suspect.video.message_id
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
        const { message_id } = ctx.scene.state as { message_id: number }
        if (userAnswer === ControlCommandEnum.GOOD && message_id) {
            await this._suspectsService.deleteFromSuspect(message_id)
        }
        if (userAnswer === ControlCommandEnum.BAD && message_id) {
            await this._suspectsService.banVideo(message_id)
        }
        await ctx.scene.reenter()
    }
}
