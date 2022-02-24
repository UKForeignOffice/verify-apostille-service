const moment = require("moment");

var IpService = {

    unblockIpsIfDayPassed: async function() {
        await VerifyApostilleIpLog.destroy({
            where: {
                and: [
                    { BlockedAt: { '<=' : moment().subtract(1, 'days').toDate() } },
                    { BlockedAt: { '!=' : "" } }
                ]
            }
        })
    },

    // Called upon failed request to findApostille
    logFailedRequestForIp: async function(ip) {
        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        // If nothing, make a row, else if 1 off being blocked, inform blocked, else increment
        if(IpLog == undefined || IpLog.id == null) {
            await VerifyApostilleIpLog.create({
                id: ip,
                FailedAttempts: 1,
                BlockedAt: ""
            });
        } else if(IpLog.FailedAttempts == sails.config.maxFailedAttempts - 1) {
            await VerifyApostilleIpLog
                .updateOne({ id: IpLog.id })
                .set(
                    {
                        FailedAttempts: IpLog.FailedAttempts + 1,
                        BlockedAt: new Date().toISOString()
                    }
                );

            console.log("BLOCKED: " + ip);
        } else {
            await VerifyApostilleIpLog
                .updateOne({ id: IpLog.id })
                .set({ FailedAttempts: IpLog.FailedAttempts + 1 });
        }
    },

    // Called upon entry to findApostille
    shouldIPBeRateLimited: async function(ip) {
        if(ip == null) return false;

        // await this.unblockIpIfDayPassed(ip);
        await this.unblockIpsIfDayPassed();

        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        if(IpLog == undefined || IpLog.id == null) {
            return false;
        }

        return IpLog.FailedAttempts >= sails.config.maxFailedAttempts;
    }
};

module.exports = IpService;