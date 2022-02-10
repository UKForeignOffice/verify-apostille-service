const maxFailedAttempts = 15;

var IpService = {

    //Note: Requires a DIFFERENT IP to call this and unblock if the IP is blocked, as this function is only called
    // when an incorrect lookup is done
    clearIpLogIfNewDay: async function() {
        var datetime = new Date();
        var day = datetime.getDay();
        var yesterday = day - 1;

        var IpLog = await VerifyApostilleIpLog.find({
            where: {
                Day: yesterday
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
        await this.clearIpLogIfNewDay();
    
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
        if(ip == null) return false;

        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        if(IpLog == undefined || IpLog.id == null) {
            return false;
        }

        if(IpLog.FailedAttempts >= maxFailedAttempts) return true;
        else return false;
    }
};

module.exports = IpService;