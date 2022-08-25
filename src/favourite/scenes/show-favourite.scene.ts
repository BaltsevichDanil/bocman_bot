import { Action, Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SceneContext } from 'telegraf/typings/scenes'

import { channelName, findLimit } from '../../constants/constants'
import { ControlCommandEnum } from '../../enums/control-command.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { keyboardRefactor } from '../../helpers/keyboard.refactor'
import { sendVideos } from '../../helpers/sendVideos'
import { SkipVideoInterface } from '../../videos/interfaces/skip-video.interface'
import { FavouriteService } from '../favourite.service'

@Scene(SceneNameEnum.SHOW_FAVOURITE)
export class ShowFavouriteScene {
    constructor(private readonly _favouriteService: FavouriteService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const favourites = await this._favouriteService.showFavourites({
                chat_owner_id: ctx.chat.id,
            })
            if (favourites.length) {
                const videos = favourites.map((favourite) => favourite.video)
                await sendVideos(ctx, videos)
                ;(ctx.scene.state as SkipVideoInterface).skip = 0
            } else {
                await ctx.replyWithMarkdownV2(
                    keyboardRefactor(
                        'Видимо ты еще не добавлял видео в избранное',
                    ),
                    {
                        reply_markup: {
                            keyboard: [
                                [
                                    { text: 'Поиск' },
                                    { text: 'Все видео' },
                                    { text: 'Показать избранное' },
                                ],
                            ],
                            resize_keyboard: true,
                        },
                    },
                )
                await ctx.scene.leave()
            }
        }
    }

    @Action(ControlCommandEnum.NEXT)
    async onNext(@Ctx() ctx: SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const { skip } = ctx.scene.state as SkipVideoInterface
            const newSkip = skip + findLimit
            const favourites = await this._favouriteService.showFavourites({
                chat_owner_id: ctx.chat.id,
                skip: newSkip,
            })

            if (favourites.length) {
                const videos = favourites.map((favourite) => favourite.video)
                await sendVideos(ctx, videos)
                ;(ctx.scene.state as SkipVideoInterface).skip = newSkip
            } else {
                await ctx.reply('Походу все')
            }
        }
    }

    @Action(ControlCommandEnum.PREV)
    async onPrev(@Ctx() ctx: SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            const { skip } = ctx.scene.state as SkipVideoInterface
            const newSkip = skip - findLimit
            if (newSkip < 0) {
                await ctx.reply('Куда еще назад то?')
            } else {
                const favourites = await this._favouriteService.showFavourites({
                    chat_owner_id: ctx.chat.id,
                    skip: newSkip,
                })
                if (favourites.length) {
                    const videos = favourites.map(
                        (favourite) => favourite.video,
                    )
                    await sendVideos(ctx, videos)
                    ;(ctx.scene.state as SkipVideoInterface).skip = newSkip
                }
            }
        }
    }

    @Action(/^\d+$/)
    async onSelect(
        @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        const parsedUserAnswer = parseInt(userAnswer as string, 10)
        const video = await this._favouriteService.showVideo(parsedUserAnswer)
        if (video && ctx.chat?.id) {
            await ctx.telegram.copyMessage(
                ctx.chat.id,
                channelName,
                video.message_id,
            )
        }
    }

    @Action(ControlCommandEnum.CANCEL)
    @Command(ControlCommandEnum.CANCEL)
    async onCancel(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2(
            keyboardRefactor('А чего это мы вдруг? Ну ладно выхожу..'),
            {
                reply_markup: {
                    keyboard: [
                        [
                            { text: 'Поиск' },
                            { text: 'Все видео' },
                            { text: 'Показать избранное' },
                        ],
                    ],
                    resize_keyboard: true,
                },
            },
        )
        await ctx.scene.leave()
    }
}
