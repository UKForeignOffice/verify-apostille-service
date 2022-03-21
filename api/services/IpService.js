const moment = require("moment");

var IpService = {

    /**
     * Delete rows when a day has passed since blocked, 
     * or when a day has passed since first block and haven't been blocked
     */
    unblockIpsIfDayPassed: async function() {
        await VerifyApostilleIpLog.destroy({
            where: {
                or: [
                    {
                        and: [
                            { BlockedAt: { '<=' : moment().subtract(1, 'days').toDate() } },
                            { BlockedAt: { '!=' : "" } }
                        ]
                    },
                    {
                        and: [
                            { FirstFailedAttemptAt: { '<=' : moment().subtract(1, 'days').toDate() } },
                            { BlockedAt: "" }
                        ]
                    }
                ]
            }
        });
    },

    // Called upon failed request to findApostille
    logFailedRequestForIp: async function(ip) {
        var IpLog = await VerifyApostilleIpLog.findOne({
            id: ip
        });

        // If nothing, make a row; else if 1 off being blocked, inform blocked; else increment
        if(IpLog == undefined || IpLog.id == null) {
            await VerifyApostilleIpLog.create({
                id: ip,
                FailedAttempts: 1,
                FirstFailedAttemptAt: new Date().toISOString(),
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