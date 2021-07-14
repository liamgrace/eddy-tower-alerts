class CheckCollection {
 constructor(site){
     this.checks = []
     this.site = site;
     this.deadman = false;
 }
 performCheck(summary){
     this.checks.map(p => p.check(summary[p.param]));
 }
}

class Check {
    constructor(warningLevel){
        this.warningLevel = warningLevel;
    }
}

class rangeCheck extends Check {
    constructor(obj){
        super(obj.warningLevel);
        this.param = obj.param;
        this.min = obj.min;
        this.max = obj.max;
        this.desc = obj.desc;
        this.passing = true;
    }

    check(paramData){
        paramData.map(dataPoint => {
            try {
                let pF = parseFloat(dataPoint.val)
                if(pF > this.max || pF < this.min) this.passing = false;
            } catch (e){
               this.passing = false;
               super.warningLevel = "PARSE ERROR"
            }

        })
    }
}

class rangeCheckAdvanced extends Check {
    constructor(obj){
        super(obj.warningLevel);
        this.param = obj.param;
        this.min = obj.min;
        this.max = obj.max;
        this.timeStart = obj.timeStart;
        this.timeEnd = obj.timeEnd;
        this.desc = obj.desc;
        this.passing = true;
    }

    check(paramData){
        let filtered = paramData.filter(p => (p.timeSec >= this.timeStart && p.timeSec <= this.timeEnd));
        filtered.map(dataPoint => {
            try {
                let pF = parseFloat(dataPoint.val)
                if(pF > this.max || pF < this.min) this.passing = false;
            } catch (e){
                this.passing = false;
                super.warningLevel = "PARSE ERROR"
            }
        })
    }
}

class sumCheckMin extends Check {
    constructor(obj) {
        super(obj.warningLevel);
        this.param = obj.param;
        this.min = obj.min;
        this.desc = obj.desc;
        this.passing = true;
    }

    check(paramData) {
        try {
            let sum = paramData.reduce((acc, p) => acc + parseFloat(p.val), 0);
            if(sum > this.min) this.passing = false;
        } catch (e){
            this.passing = false;
            super.warningLevel = "PARSE ERROR"
        }
    }
}

module.exports = {
    CheckCollection: CheckCollection,
    Check: Check,
    rangeCheck: rangeCheck,
    rangeCheckAdvanced: rangeCheckAdvanced,
    sumCheckMin:sumCheckMin
};

