const maxFailedAttempts = 15;

var IpService = {

    clearIpLogIfNewDay: async function() {
        var datetime = new Date();
        var day = datetime.getDay();

        var IpLog = await VerifyApostilleIpLog.findOne({
            where: {
                Day: day - 1
            }
        });

        if(IpLog != undefined) {
            if(IpLog.day != day) {
                VerifyApostilleIpLog.destroy();
            }
        }
    },
    
    storeIp: async function(ip) {
        this.clearIpLogIfNewDay();
    
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
    }
};

module.exports = IpService;