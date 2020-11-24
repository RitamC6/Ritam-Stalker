const si = require("systeminformation");
const Discord = require("discord.js");
const client = new Discord.Client();
const pretty = require("prettysize");
const screenshot = require("screenshot-desktop");
const activeWin = require('active-win')
const config = require('./config.json');
 
//Client event ready
client.on("ready", async () => {
    console.log('Bot is online and stalking.')
setInterval(async () => {
const active = await activeWin();
client.user.setActivity("Window active: " + active.title)
}, 2000)
});
 
//Command handler
client.on('message',async  message => {
    if (message.author.bot) return;
 
    const prefix = "r!";
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`);
 
 
    if (command == "laptop") {
        message.channel.send('Loading...')
        var cpudata = await si.cpu();
        var cl = await si.currentLoad();
        var memdata = await si.mem();
        var ramused = pretty(memdata.active);
        var ramtotal = pretty(memdata.total);
        var diskdata = await si.fsSize();
        var diskused = pretty(diskdata[0].used);
        var disktotal = pretty(diskdata[0].size);
        var batt = await si.battery();
        var wifi = await si.wifiNetworks();
        var osinfo = await si.osInfo()
 
        const embed = new Discord.MessageEmbed()
            .addField('Realtime Laptop Info', "\nCPU: " + cpudata.manufacturer + " " + cpudata.brand + ". (Usage: " + cl.currentload.toFixed(2) + "%) \nMEMORY: " + ramused + " out of " + ramtotal + " \nDISK: " + diskused + " out of " + disktotal)
            .addField('Misc Info ', "Battery: " + batt.percent + "%, Plugged in: " + batt.acconnected + " \nWiFi: Connected to: " + wifi[0].ssid + ", Signal Quality: " + wifi[0].quality + "% \nOS: " + osinfo.distro)
        message.channel.send(embed)
    } else if (command == "screenshot") {
        if (config.screenshot == "allow") {
screenshot.listDisplays().then((displays) => {
            screenshot({format: 'png'}).then((img) => {
                message.channel.send("Screenshot 1st screen:", {
                    files: [
                        img
                    ]
                });
            });
/**screenshot({format: 'png', screen: displays[displays.length - 1].id}).then((img) => {
                message.channel.send("Screenshot 2nd screen:", {
                    files: [
                        img
                    ]
                });
            });**/
});
        } else {
            message.channel.send('Screenshots are set to disabled.')
        }
    } else if (command == "help") {
        message.channel.send('Current commands: `r!laptop` | Shows laptop info, `r!screenshot` | Screenshot Ritams screen')
    }
 
})
 
client.login(config.token);