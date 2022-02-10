var ipLog = {};
const maxFailedAttempts = 15;

var IpService = {
    
    storeIp: function(ip, lookupSuccess){
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