import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf'
import { Context, Scenes } from 'telegraf'

import { commands } from '../constants/constants'

import { FindVideoData } from './scenes/data/findVideo.data'
import { UploadVideoData } from './scenes/data/uploadVideo.data'
import { TelegramService } from './telegram.service'

@Update()
export class TelegramUpdate {
    constructor(private readonly _telegramService: TelegramService) {}

    @Start()
    async start(@Ctx() ctx: Context): Promise<void> {
        if (ctx.from) {
            const { username, id } = ctx.from
            await this._telegramService.createUser({ username, chat_id: id })
        }
        await ctx.reply(
            `Привет! Если у тебя сейчас идет важная переписка и тебе срочно понадобился смешной видос, который отбразит твои чувства в данный момент, то этот бот создан для тебя`,
        )
        await ctx.replyWithMarkdownV2(
            `Просто введи фразу, которая звучала в видосе и бот пересмотрит всю свою базу ради того, чтобы найти это видео для тебя😎`,
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
    }

    @Command(commands.upload)
    async uploadVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(UploadVideoData.sceneName)
    }

    @Hears('Поиск')
    @Command(commands.video)
    async findVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(FindVideoData.sceneName)
    }

    @Hears('Показать избранное')
    @Command(commands.favourite)
    async showFavourite(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(commands.favourite)
    }

    @Hears('Все видео')
    @Command(commands.videos)
    async findVideos(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter('find_all_videos')
    }

    @Command('suspect')
    async showSuspects(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter('suspect')
    }
}
