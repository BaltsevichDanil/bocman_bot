import { Action, Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { ControlCommandEnum } from '../../enums/control-command.enum'
import { RoleEnum } from '../../enums/role.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { keyboardRefactor } from '../../helpers/keyboard-refactor'
import { UsersService } from '../../users/users.service'
import { SupportsService } from '../supports.service'

@Scene(SceneNameEnum.READ_SUPPORT)
export class ReadSupportScene {
    constructor(
        private readonly _supportsService: SupportsService,
        private readonly _usersService: UsersService,
    ) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const user = await this._usersService.findUser(ctx.chat.id)
            if (user && user.role === RoleEnum.ADMIN) {
                const support = await this._supportsService.getLastSupport()
                if (support) {
                    ;(ctx.scene.state as { supportId: string }).supportId =
                        support.id
                    await ctx.replyWithMarkdownV2(
                        keyboardRefactor(
                            `Обращение:\nЧат: ${support.chat_id}\nТекст: ${support.text}`,
                        ),
                        {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Закрыть',
                                            callback_data:
                                                ControlCommandEnum.NEXT,
                                        },
                                        {
                                            text: 'Ответить',
                                            callback_data:
                                                ControlCommandEnum.ANSWER,
                                        },
                                    ],
                                ],
                            },
                        },
                    )
                } else {
                    await ctx.reply('Обращений нет')
                    await ctx.scene.leave()
                }
            } else {
                await ctx.scene.leave()
            }
        }
    }

    @Action(ControlCommandEnum.NEXT)
    async onClose(@Ctx() ctx: SceneContext): Promise<void> {
        const { supportId } = ctx.scene.state as { supportId: string }
        await this._supportsService.closeSupport(supportId)
        await ctx.scene.reenter()
    }

    @Action(ControlCommandEnum.ANSWER)
    async onAnswer(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.reply('Напиши ответ:')
    }

    @On('text')
    async onAnswerText(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        const { supportId } = ctx.scene.state as { supportId: string }
        const support = await this._supportsService.findSupport(supportId)
        if (support) {
            try {
                await ctx.telegram.sendMessage(
                    support.chat_id,
                    `Ответ на обращение: ${supportId}\n\n${ctx.message.text}`,
                )
                await this._supportsService.closeSupport(supportId)
            } catch (e) {
                await ctx.reply(e.message)
                await this._supportsService.closeSupport(supportId)
            }
        } else {
            await ctx.reply('С обращением что-то произошло')
            await ctx.scene.leave()
        }
        await ctx.scene.reenter()
    }

    @Command(ControlCommandEnum.CANCEL)
    async onExit(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.scene.leave()
    }
}
