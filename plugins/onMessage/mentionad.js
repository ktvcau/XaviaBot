import fs from 'fs';

const langData = {
    "vi_VN": {
        "UserMention": [
          "Vui lòng gửi tin nhắn riêng cho Admin\nNhắn tin qua: https://m.me/vulahanix",
          "Vui lòng đợi phản hồi từ Admin hoặc bạn gửi tin nhắn riêng qua: https://m.me/vulahanix"              
        ]
    }
}

function onCall({ message, getLang }) {
    if (Object.keys(message.mentions).length == 0 || message.senderID == global.botID) return;

    const config = JSON.parse(fs.readFileSync('./config/config.main.json', 'utf8'));
    const moderators = config.ABSOLUTES || [];

    for (let moderator of moderators) {
        if (message.mentions[moderator]) {
            const userMentionMessages = getLang("UserMention");
            if (Array.isArray(userMentionMessages)) {
                const randomIndex = Math.floor(Math.random() * userMentionMessages.length);
                const replyMessage = userMentionMessages[randomIndex];
                message.reply(replyMessage);
            } else {
                message.reply(userMentionMessages);
            }
            return; 
        }
    }
}

export default {
    langData,
    onCall
}
