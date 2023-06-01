const events = require('events');

const SalesMachine = function(data){
    
    this.stateLabel = '';
    this.error = null;
    this.machine = this;
    this.events = new events.EventEmitter();
    this.data = data;

    this.start = () => {
        this.changeState('Sales', this);
    }

    this.changeState = (name, machine) => {
        if(name === 'done'){
            this.stateLabel = '';
            this.error = null;
            this.machine = this;
            this.events.emit('change', {
                label: "done", 
                machine: this,
                error: this.error,
            });
            this.events = new events.EventEmitter();

        }else{
            this.stateLabel = name;
            this.events.emit('change', {
                label: this.stateLabel, 
                machine: this,
                error: this.error,
            });
            const getState = this[name.split(' ').join('').toLowerCase()]
            getState(machine);
        }
    }

    this.onStateChange = function(getUpdatedRecords){
        this.events.on('change', function(data){
            getUpdatedRecords({
                label: data.label, 
                mch: data.machine, 
                error: data.error, 
            });
        });
    }

    this.sales = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('Return to tank', mch);
            }, 1000);
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.returntotank = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('eSales', mch);
            }, 1000);
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.esales = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('Expenses', mch);
            }, 1000);
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.expenses = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('Payments', mch);
            }, 1000);

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.payments = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('Dipping', mch);
            }, 1000);
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.dipping = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('Tank levels', mch);
            }, 1000);
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.tanklevels = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('done', mch);
            }, 1000);
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }
}

module.exports = SalesMachine;

//Buffer.from(data, 'base64').toString('ascii'); to decode
//Buffer.from(JSON.stringify(mch)).toString('base64') to encode

//jc.decycle(a)
//jc.retrocycle(JSON.parse(s));