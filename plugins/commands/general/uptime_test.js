import countryTimezones from 'country-timezones';

const config = {
    name: "uptime_test",
    aliases: ["upt_test"],
    description: "Update bot uptime (Mod adds: display current time in your country - default is Vietnam)",
    usage: "[area]",
    permissions: [2],
    credits: "XIE"
};

const langData = {
    vi_VN: {
        SendTime: "> ONLINE <\nThời gian bot hoạt động: {hours} giờ {minutes} phút {seconds} giây\nThời gian hiện tại ở {country}: {currentTime}",
        Illegal: "Mã quốc gia không hợp lệ. Vui lòng cung cấp mã quốc gia hợp lệ.",
        DayOfWeek: ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
        Periods: {
            Morning: "Sáng",
            Noon: "Trưa",
            Afternoon: "Chiều",
            Evening: "Tối",
            Night: "Đêm"
        }
    },
    en_US: {
        SendTime: "> ONLINE <\nBot active time: {hours} hours {minutes} minutes {seconds} seconds\nCurrent time in {country}: {currentTime}",
        Illegal: "Invalid country code. Please provide a valid country code.",
        DayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        Periods: {
            Morning: "Morning",
            Noon: "Noon",
            Afternoon: "Afternoon",
            Evening: "Evening",
            Night: "Night"
        }
    }
};

function getCurrentTimeInTimezone(timezone, lang) {
  const now = new Date(new Date().toLocaleString("vi-VN", { timeZone: timezone }));
  const dayOfWeek = lang.DayOfWeek[now.getDay()];
  const date = now.toLocaleDateString("vi-VN");
  const time = now.toLocaleTimeString("vi-VN", { hour12: true }); 
  const period = getTimePeriod(now, lang);
  return `${dayOfWeek}, ${date} | ${period}: ${time}`;
}

function getTimePeriod(date, lang) {
    const hour = date.getHours();
    if (hour > 1 && hour < 11) return lang.Periods.Morning;
    else if (hour >= 11 && hour < 13) return lang.Periods.Noon;
    else if (hour >= 13 && hour < 17) return lang.Periods.Afternoon;
    else if (hour >= 17 && hour < 22) return lang.Periods.Evening;
    else return lang.Periods.Night;
}

async function onCall({ message, getLang }) {
    try {
        const uptimeInSeconds = process.uptime();
        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);

        let currentTimeText;

        if (message && message.content) {
            const commandArgs = message.content.split(' ');

            if (commandArgs.length > 1) {
                const countryCode = commandArgs[1].toUpperCase();
                const countryData = countryTimezones.findByCountry(countryCode);

                if (countryData) {
                    const timezoneOffset = countryData.offset / 60;
                    const currentTime = getCurrentTimeInTimezone(countryData.timezone, getLang());
                    const country = countryData.country;
                    currentTimeText = getLang('SendTime', { hours, minutes, seconds, country, currentTime });
                } else {
                    currentTimeText = getLang("Illegal");
                }
            } else {
                const currentTime = getCurrentTimeInTimezone("Asia/Ho_Chi_Minh", getLang());
                const country = "Vietnam"; // Default country
                currentTimeText = getLang('SendTime', { hours, minutes, seconds, country, currentTime });
            }
        } else {
            const currentTime = getCurrentTimeInTimezone("Asia/Ho_Chi_Minh", getLang());
            const country = "Vietnam"; // Default country
            currentTimeText = getLang('SendTime', { hours, minutes, seconds, country, currentTime });
        }

        const sentMessage = await message.send({
            body: currentTimeText
        });

        console.log(sentMessage);
    } catch (error) {
        console.error(error);
    }
}

export default {
    config,
    langData,
    onCall
};
