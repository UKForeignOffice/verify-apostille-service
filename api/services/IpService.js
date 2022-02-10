var ipLog = {};
const maxFailedAttempts = 15;

var IpService = {

    clearIpLogIfNewDay: function() {
        var datetime = new Date();
        var day = datetime.getDay();

        if(ipLog.day != day) {
            ipLog = {};
            ipLog.day = day;
        }
    },
    
    storeIp: function(ip, lookupSuccess){
        this.clearIpLogIfNewDay();

        if(ip == null || lookupSuccess) return;

        if(ipLog[ip] == null){
            ipLog[ip] = 1;
        } else {
            ipLog[ip]++;
        }
    },

    shouldIPBeRateLimited: function(ip) {
        if(ip == null) return false;

        if(ipLog[ip] >= maxFailedAttempts) return true;
    }
};

module.exports = IpService;