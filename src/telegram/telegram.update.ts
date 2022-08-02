import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf'
import { Context, Scenes } from 'telegraf'

import { commands } from '../constants/constants'

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
                    keyboard: [[{ text: 'Показать все доступные видео' }]],
                    resize_keyboard: true,
                },
            },
        )
    }

    @Command(commands.command2)
    async uploadVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(UploadVideoData.sceneName)
    }

    @Command(commands.command1)
    async findVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter('find_video')
    }

    @Help()
    async help(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        ctx.scene.enter('basicScene')
    }
}
