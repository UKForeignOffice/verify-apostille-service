var IpService = {

    unblockIpIfDayPassed: async function(ip) {
        var IpRecord = await VerifyApostilleIpLog.findOne({ id: ip });

        if(IpRecord != undefined && IpRecord != null) {
            if(IpRecord.BlockedAt != "") {
                const dateTime = new Date();
                const dateTimeBlocked = new Date(IpRecord.BlockedAt);

                const oneDayInMiliseconds = 60 * 60 * 24 * 1000;
                const dateTimeBlockedPlus24Hours = new Date(dateTimeBlocked.getTime() + oneDayInMiliseconds);
    
                if(dateTime >= dateTimeBlockedPlus24Hours) {
                    await VerifyApostilleIpLog.destroyOne({ id: ip });
                    console.log("UNBLOCKED: " + ip);
                }
            }
        }
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
                        BlockedAt: new Date().toString()
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

        // await this.clearIpLogIfNewDay();
        await this.unblockIpIfDayPassed(ip);

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