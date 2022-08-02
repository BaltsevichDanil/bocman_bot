import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { channelName, commands, findLimit } from '../../constants/constants'
import { sendVideos } from '../../helpers/sendVideos'
import { VideoDto } from '../dtos/video.dto'
import { FavouriteEntity } from '../entities/favourite.entity'
import { VideoEntity } from '../entities/video.entity'
import { TelegramService } from '../telegram.service'

@Scene('favourite')
export class ShowFavouriteScene {
    constructor(private readonly _telegramService: TelegramService) {}

    protected _parseVideos(favourites: FavouriteEntity[]): VideoDto[] {
        return favourites.map((favourite) => ({
            text: favourite.video.text,
            message_id: favourite.video.message_id,
            owner_chat_id: favourite.video.owner_chat_id,
        }))
    }

    @SceneEnter()
    async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        const skip = 0
        if (ctx.chat?.id) {
            const favourites = await this._telegramService.findFavourite(
                ctx.chat.id,
                skip,
            )
            const videos = this._parseVideos(favourites)
            if (videos.length) {
                await sendVideos(ctx, videos, skip, videos.length)
            } else {
                ctx.reply('Ничего не нашлось')
                ctx.scene.leave()
            }
        }
    }

    @Action(/0|1|2|3|4|5|6|7|8|9/)
    async onSelect(
        @Ctx()
        ctx: Scenes.SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        const parsedUserAnswer = parseInt(userAnswer as string, 10)
        // @ts-ignore
        const { videos }: { videos: VideoEntity[] } = ctx.scene.state
        if (parsedUserAnswer >= 0 && ctx.chat?.id && videos.length) {
            if (typeof videos[parsedUserAnswer] !== 'undefined') {
                await ctx.telegram.copyMessage(
                    ctx.chat.id,
                    channelName,
                    // @ts-ignore
                    videos[parsedUserAnswer].message_id,
                )
            }
        }
    }

    @Action(commands.next)
    async onNext(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            // @ts-ignore
            const { skip }: { skip: number } = ctx.scene.state
            const favourites = await this._telegramService.findFavourite(
                ctx.chat.id,
                skip,
            )
            const videos = this._parseVideos(favourites)
            if (!videos.length) {
                ctx.reply('Походу все')
            } else {
                await sendVideos(ctx, videos, skip, videos.length)
            }
        }
    }

    @Action(commands.prev)
    async onPrev(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        if (ctx.chat?.id) {
            // @ts-ignore
            const { skip }: { skip: number } = ctx.scene.state

            if (skip - findLimit <= 0) {
                ctx.reply('Куда еще назад то?')
            } else {
                const favourites = await this._telegramService.findFavourite(
                    ctx.chat.id,
                    skip,
                )
                const videos = this._parseVideos(favourites)
                if (!videos.length) {
                    ctx.reply('Чего-то ты намудрил, что у меня все сломалось')
                } else {
                    await sendVideos(ctx, videos, skip, -findLimit)
                }
            }
        }
    }

    @Action(commands.cancel)
    async onCancel(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2('Выхожу выхожу', {
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
        })
        await ctx.scene.leave()
    }
}
