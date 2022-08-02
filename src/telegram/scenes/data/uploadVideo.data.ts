export const UploadVideoData = {
    sceneName: 'upload_video',
    introduction: {
        step: 1,
        reply: 'Напиши ключевые слова, по которым можно будет найти видео: \n\n Для отмены напиши /cancel',
    },
    haveThisVideo: {
        reply: 'Такое видео у меня уже есть',
    },
    sendVideo: {
        step: 2,
        reply: 'А теперь отправь видео:',
    },
    result: {
        step: 3,
        reply: 'Вот, что получилось:',
    },
    maxTextLengthError: {
        reply: 'Не больше 100 символов',
    },
    cancel: {
        reply: 'Галя, отмена',
    },
}
