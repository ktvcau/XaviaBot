const config = {
    name: "gỡ",
    permissions: [2],
    credits: "XIE",
    description: "Gỡ tin nhắn của bot",
    usage: "gỡ"
};

const langData = {
    "vi_VN": {
        "notReply": "Bạn phải reply tin nhắn của bot",
        "notBotMessage": "Tin nhắn bạn reply không phải của bot",
        "error": "Đã có lỗi xảy ra"
    }
}

async function onCall({ message, args, getLang, userPermissions }) {
    try {
        if (message.type != "message_reply") return message.reply(getLang("notReply"));
        if (message.messageReply?.senderID != global.botID) return message.reply(getLang("notBotMessage"));

        const targetMessageID = message.messageReply.messageID;

        return global.api.unsendMessage(targetMessageID, (e) => {
            if (e) return message.react("❌");
            message.react("✅");
        });
    } catch (err) {
        console.error(err);
        message.reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall
}
