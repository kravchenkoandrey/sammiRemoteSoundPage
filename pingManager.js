let pingManager = {
    broadcastChannel: "",
    connectionTimeout: 0,
    pingInterval: 0, 
    lastPing: 0,
    lastPong: 0,
    isBcClientConnected: false,
    
    initialize: function(_broadcastChannel, _connectionTimeout, _pingInterval){
        this.broadcastChannel = _broadcastChannel;
        this.connectionTimeout = _connectionTimeout;
        this.pingInterval = _pingInterval;
        this.addEvent(this.broadcastChannel, "message", (event)=>{
            if(event.data.command == "pong"){
                this.handlePong();
            }
            if(event.data.command == "ping"){
                this.lastPing = Date.now();
            }
        });
    
        setInterval(this.sendPing.bind(this), this.pingInterval);
        console.log("Ping manager initialized");
        console.log(this);
    },

    handlePong: function(){
        this.lastPong = Date.now();
        if (!this.isBcClientConnected){
            this.setBcClientConnectionStatus(true);
        }
    },

    setBcClientConnectionStatus: function(isConnected){
        this.isBcClientConnected = isConnected;
        console.log("Remote SP connected: " + isConnected);
    },

    sendPing: function(){
        let curTime = Date.now();
        if (curTime - this.lastPing >= this.pingInterval){
            this.broadcastChannel.postMessage({command: "ping"}); 
        }
        this.checkPongs();
    },

    checkPongs: function(){
        let curTime = Date.now();
        if (curTime - this.lastPong > this.connectionTimeout && this.isBcClientConnected){
            this.setBcClientConnectionStatus(false);
        }
    },

    addEvent: function(elem = false, evType, fn, params) {
        if (elem.addEventListener) {
            elem.addEventListener(evType, fn, params);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on' + evType, fn);
        }
        else {
            elem['on' + evType] = fn;
        }
    }

}