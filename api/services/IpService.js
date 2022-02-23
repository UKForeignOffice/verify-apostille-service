var IpService = {

    clearIpLogIfNewDay: async function() {
        var datetime = new Date();
        var day = datetime.getDay();

        var IpLog = await VerifyApostilleIpLog.find({
            where: {
                Day: {'!=' : day}
            }
        }).limit(1);

        IpLog = IpLog[0];

        if(IpLog != undefined) {
            if(IpLog.Day != day) {
                await VerifyApostilleIpLog.destroy({});
            }
        }
    },

    storeIp: async function(ip) {    
        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        if(IpLog == undefined || IpLog.id == null) {
            await VerifyApostilleIpLog.create({
                id: ip,
                FailedAttempts: 0,
                Day: new Date().getDay()
            });
        } else {
            await VerifyApostilleIpLog
                .updateOne({id: IpLog.id})
                .set({FailedAttempts: IpLog.FailedAttempts + 1});
        }
    },

    shouldIPBeRateLimited: async function(ip) {
        await this.clearIpLogIfNewDay();

        if(ip == null) return false;

        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        if(IpLog == undefined || IpLog.id == null) {
            return false;
        }

        if(IpLog.FailedAttempts == sails.config.maxFailedAttempts) console.log("BLOCKED: " + ip);

        return IpLog.FailedAttempts >= sails.config.maxFailedAttempts;
    }
};

module.exports = IpService;